/* Annemle Yıldız Yolculuğu — physical toys, family spacecraft and the comet's compass.
   Every toy is optional; visible actions change a real object. No reading, failure, timer pressure or panels. */
'use strict';
(function () {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 14) return;
  const TAU = Math.PI * 2, rand = rng(142814), COLORS = ['#ffe5a1','#f4a07c','#e3b4ed','#86e4e1'];
  const toys = [], voyages = [], launches = [], finals = [];
  const sparks = Array.from({length:112},()=>({on:false,x:0,y:0,vx:0,vy:0,t:0,life:1,r:3,col:0}));
  const rings = Array.from({length:18},()=>({on:false,x:0,y:0,t:0,life:1,r:20,col:0}));
  const hand = {on:false,id:null,o:null,part:-1,x:0,y:0,px:0,py:0,d:0,ang:0,kind:''};
  const point = {x:0,y:0}, cameraBox = {x0:0,y0:0,x1:0,y1:0}, attentionBox={x0:0,y0:0,x1:0,y1:0};
  const encounter={o:null,phase:'none',age:0,phaseAge:0,start:0,phaseStart:0,stopX:0,targetX:0,targetY:0,hold:false};
  const focusPoint={x:0,y:0};
  const viewState = {insideShip:false,shipX:0,shipY:720,shipScale:1,flight:null,activity:null,final:false,crewPose:'ayakta',crewX:0,crewY:720};
  const buddy = {x:0,y:0,vx:0,vy:0,initialized:false,joy:0,look:0};
  const stats = {manual:0,assisted:0,replayed:0,flightStars:0};
  let time = 0, activeFlight = null, activeFinal = null, particleHead = 0, ringHead = 0, atlas = null;
  const sat = u => clamp(u,0,1), ease = u => smooth(sat(u));
  const validDt = dt => Number.isFinite(dt) && dt > 0 ? Math.min(dt,.05) : 0;
  function near(o,r=480){return Math.abs(P.x-o.x)<r && Math.abs(P.y-o.y)<400;}
  function visible(x,r=350){return typeof cam==='undefined'||x+r>cam.x-60 && x-r<cam.x+VW+60;}
  function ev(name,data){OLAY.emit(name,data);}
  function pose(name,opt){if(window.AILE14&&typeof AILE14.pose==='function')AILE14.pose(name,opt||{sure:1.2});}
  function oval(c,x,y,rx,ry,col,ang=0){c.fillStyle=col;c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),ang,0,TAU);c.fill();}
  function path(c,points,col,w=2){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.beginPath();for(let i=0;i<points.length;i++)i?c.lineTo(points[i][0],points[i][1]):c.moveTo(points[i][0],points[i][1]);c.stroke();}
  function round(c,x,y,w,h,r,col){c.fillStyle=col;c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.fill();}
  function star(c,x,y,r,col,rot=0){c.fillStyle=col;c.beginPath();for(let i=0;i<8;i++){const a=rot+i*Math.PI/4-Math.PI/2,q=i%2?r*.29:r;i?c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q):c.moveTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();c.fill();}
  function ring(x,y,col=0,r=24){const p=rings[ringHead++%rings.length];Object.assign(p,{on:true,x,y,t:0,life:1.6,r,col});}
  function sparkle(x,y,n=10,col=0){for(let i=0;i<n;i++){const p=sparks[particleHead++%sparks.length],a=rand()*TAU,v=20+rand()*72;Object.assign(p,{on:true,x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-35,t:0,life:.7+rand()*.9,r:2+rand()*4,col});}}
  function canvas(w,h){const c=document.createElement('canvas');c.width=w*2;c.height=h*2;return c;}
  function warm(){
    if(atlas)return;atlas={};
    const a=canvas(480,280),c=a.getContext('2d');c.scale(2,2);
    // A pearl exploration craft. The large shared cabin lets a child see both astronauts.
    c.translate(235,183);
    const hull=c.createLinearGradient(0,-137,0,34);hull.addColorStop(0,'#f7f5e8');hull.addColorStop(.32,'#d6e6ed');hull.addColorStop(.7,'#8eafc7');hull.addColorStop(1,'#536d95');c.fillStyle=hull;
    c.beginPath();c.moveTo(-177,0);c.bezierCurveTo(-188,-43,-174,-96,-134,-112);c.bezierCurveTo(-92,-147,11,-143,65,-105);c.bezierCurveTo(107,-88,161,-48,194,-15);c.quadraticCurveTo(168,15,106,24);c.lineTo(-123,27);c.quadraticCurveTo(-161,24,-177,0);c.fill();
    c.strokeStyle='#eaf7fc';c.lineWidth=3;c.beginPath();c.moveTo(-161,-34);c.bezierCurveTo(-140,-106,-64,-126,28,-100);c.stroke();
    c.fillStyle='#526c9a';c.beginPath();c.moveTo(-112,10);c.lineTo(-157,37);c.quadraticCurveTo(-119,44,-78,22);c.closePath();c.fill();
    c.fillStyle='#a8bed9';c.beginPath();c.moveTo(-144,-64);c.lineTo(-183,-103);c.lineTo(-161,-8);c.closePath();c.fill();
    round(c,-196,-38,40,50,11,'#48577b');round(c,-199,-32,13,38,5,'#8bbfd0');
    c.fillStyle='#506b93';c.beginPath();c.ellipse(-22,-61,99,64,-.08,0,TAU);c.fill();
    const glass=c.createLinearGradient(0,-120,0,-7);glass.addColorStop(0,'#547da1');glass.addColorStop(1,'#203953');c.fillStyle=glass;c.beginPath();c.ellipse(-22,-61,91,57,-.08,0,TAU);c.fill();
    path(c,[[-117,-60],[71,-60]],'rgba(202,231,241,.19)',1.5);
    round(c,-65,6,142,15,7,'#7a86b1');round(c,-56,8,123,4,2,'#d3edf2');
    for(let i=0;i<5;i++)round(c,85+i*14,-10+i*2,7,7,3,i===0?'#f0c476':'#8ea6c7');
    star(c,122,-21,14,'#eff7e6');oval(c,169,-13,7,5,'#9ccbe0');
    
    // Nested engine jacket, fine ceramic seams and real-looking inspection fasteners.
    round(c,-210,-40,48,55,12,'#334c6c');round(c,-215,-33,21,40,7,'#799bb4');round(c,-217,-29,8,31,4,'#badadf');
    for(let i=0;i<4;i++){path(c,[[-188+i*7,-31],[-188+i*7,6]],'#8ca8be',1.5);}
    path(c,[[-146,-90],[-133,-41],[-149,-10]],'#7290a8',1.5);path(c,[[79,-91],[103,-62],[106,-31],[154,-15]],'#7290a8',1.4);
    path(c,[[-137,-6],[66,-7],[112,-1]],'#5e7b98',1.2);path(c,[[-114,19],[58,19],[100,12]],'#c1d4db',1.2);
    for(const p of [[-146,-16],[-129,-88],[88,-54],[126,-9],[18,17],[-94,16]]){oval(c,p[0],p[1],2.2,2.2,'#55748e');oval(c,p[0]-.4,p[1]-.6,.75,.75,'#d8e7e3');}
    c.save();c.globalAlpha=.6;path(c,[[-103,-118],[-69,-128],[-32,-129]],'#fff9e5',1.5);c.restore();
    // Soft upholstered seats and a little shared instrument binnacle stay behind faces.
    for(const seat of [[-63,-15],[13,-17]]){round(c,seat[0]-15,seat[1]-39,30,39,9,'#455c79');round(c,seat[0]-12,seat[1]-37,24,31,8,'#8197ae');round(c,seat[0]-17,seat[1]-3,38,8,4,'#a8b6c4');path(c,[[seat[0]-10,seat[1]-28],[seat[0]+9,seat[1]-28]],'#c0d0d1',1);}
    round(c,48,-37,39,14,5,'#394e70');round(c,53,-35,14,8,2,'#91c9cd');path(c,[[73,-25],[75,-42]],'#cbd9dd',2.2);oval(c,75,-43,3.4,3.4,'#e9ce91');
    for(let i=0;i<3;i++)oval(c,71+i*5,-32,1.2,1.2,['#e9cf9a','#c4d9b2','#aacde0'][i]);
    c.fillStyle='#647c98';c.beginPath();c.moveTo(-52,-41);c.lineTo(-41,-49);c.lineTo(28,-39);c.lineTo(35,-28);c.lineTo(-46,-33);c.closePath();c.fill();path(c,[[-47,-42],[28,-33]],'#b7d4d6',1.4);round(c,-28,-44,25,10,3,'#304f6f');round(c,-25,-42,19,6,2,'#8fc3ca');path(c,[[-22,-39],[-17,-40],[-12,-38],[-8,-40]],'#f2e6ba',.8);for(const joy of [[-45,-44],[24,-34]]){round(c,joy[0]-6,joy[1]+10,12,5,2,'#8c9db2');path(c,[[joy[0],joy[1]+11],[joy[0],joy[1]]],'#c3d1d3',2.2);oval(c,joy[0],joy[1],3.5,3.5,'#dec992');oval(c,joy[0]-.8,joy[1]-.8,1,1,'#fff1ce');}


    atlas.ship=a;
    const b=canvas(160,100),bc=b.getContext('2d');bc.scale(2,2);bc.translate(80,50);const glow=bc.createRadialGradient(0,0,3,0,0,62);glow.addColorStop(0,'rgba(255,236,177,.65)');glow.addColorStop(.3,'rgba(150,223,237,.25)');glow.addColorStop(1,'rgba(129,205,237,0)');bc.fillStyle=glow;bc.fillRect(-80,-50,160,100);atlas.halo=b;
    const co=canvas(96,96),cc=co.getContext('2d');cc.scale(2,2);cc.translate(48,48);const cg=cc.createRadialGradient(-4,-5,2,0,0,28);cg.addColorStop(0,'#fff9da');cg.addColorStop(.58,'#d5ece5');cg.addColorStop(1,'#8abdcf');cc.fillStyle=cg;cc.beginPath();cc.moveTo(0,-25);cc.quadraticCurveTo(9,-11,24,-7);cc.quadraticCurveTo(19,7,23,19);cc.quadraticCurveTo(7,17,-2,27);cc.quadraticCurveTo(-12,14,-26,13);cc.quadraticCurveTo(-21,0,-27,-12);cc.quadraticCurveTo(-11,-13,0,-25);cc.fill();cc.fillStyle='rgba(255,251,222,.58)';cc.beginPath();cc.moveTo(-24,-10);cc.lineTo(-3,-3);cc.lineTo(0,-24);cc.closePath();cc.fill();cc.fillStyle='rgba(93,157,183,.16)';cc.beginPath();cc.moveTo(1,3);cc.lineTo(22,18);cc.lineTo(-1,26);cc.closePath();cc.fill();path(cc,[[-24,-10],[-3,-3],[0,-24]],'rgba(255,255,241,.45)',.7);atlas.comet=co;
    const au=canvas(640,240),ac=au.getContext('2d');ac.scale(2,2);for(let layer=0;layer<3;layer++){const gradient=ac.createLinearGradient(0,15,0,225);gradient.addColorStop(0,'rgba(139,230,213,0)');gradient.addColorStop(.3,['rgba(147,234,208,.48)','rgba(174,197,235,.35)','rgba(218,182,230,.29)'][layer]);gradient.addColorStop(1,'rgba(139,230,213,0)');ac.fillStyle=gradient;ac.beginPath();for(let x=0;x<=640;x+=10){const yy=36+layer*16+Math.sin(x/640*TAU*1.5+layer*.5)*23;x?ac.lineTo(x,yy):ac.moveTo(x,yy);}for(let x=640;x>=0;x-=10)ac.lineTo(x,195+Math.sin(x/640*TAU*1.5+layer*.5)*29);ac.closePath();ac.fill();}for(let i=0;i<55;i++){const x=i*12,top=45+Math.sin(i*.17)*23;ac.strokeStyle=i%3?'rgba(224,255,225,.08)':'rgba(193,210,245,.13)';ac.lineWidth=1.1;ac.beginPath();ac.moveTo(x,top);ac.quadraticCurveTo(x+5,130,x+2,191+Math.sin(i*.21)*20);ac.stroke();}atlas.curtain=au;

  }
  function compass(c,x,y,s=1,bright=1){
    c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha*=bright;
    oval(c,0,0,36,36,'#1f3555');c.strokeStyle='#b5c9db';c.lineWidth=2;c.beginPath();c.arc(0,0,34,0,TAU);c.stroke();
    for(let w=0;w<4;w++)for(let k=0;k<3;k++){const a=-Math.PI/2+w*Math.PI/2+(k-1)*.34,o=toys.find(q=>q.world===w&&q.kind===k);c.strokeStyle=o&&o.done?COLORS[w]:'#53647c';c.lineWidth=6;c.beginPath();c.arc(0,0,24,a-.12,a+.12);c.stroke();}
    star(c,0,0,12,'#e6f6ea',time*.12);c.restore();
  }
  function comet(c,x,y,s=1,joy=0,tm=time,variant=0,look=0){
    c.save();c.translate(x,y);c.scale(s,s);c.rotate(Math.sin(tm*.9)*.06);
    c.globalAlpha*=.32;for(let i=3;i>=0;i--){c.strokeStyle=COLORS[i];c.lineWidth=8-i;c.beginPath();c.moveTo(-14,-i*2);c.bezierCurveTo(-40,-16+Math.sin(tm*3-i)*5,-55,8-i*6,-88,Math.sin(tm*2-i)*8);c.stroke();}c.globalAlpha/=.32;
    warm();c.drawImage(atlas.comet,-48,-48,96,96);
    const gaze=clamp(look||(variant===1?.4:variant===2?-.4:0),-1,1)*1.1;const blink=(Math.sin(tm*.83+1)> .993)? .1:1;oval(c,-8+gaze,-1,2.7,4*blink,'#284357');oval(c,7+gaze,-2,2.7,4*blink,'#284357');oval(c,-8.8+gaze,-2.4,1,1,'#fff');oval(c,6.2+gaze,-3.2,1,1,'#fff');
    c.strokeStyle='#4a6b7a';c.lineWidth=1.6;c.beginPath();c.arc(0,6,5+joy*2,.1,Math.PI-.15);c.stroke();oval(c,-14,6,4,2,'rgba(246,162,160,.42)');oval(c,13,5,4,2,'rgba(246,162,160,.42)');if(variant){const accent=variant===1?'#b89dd0':'#77c1b6';path(c,[[-17,13],[-4,18],[15,13]],accent,3.5);star(c,17,-17,3.4,accent,.15);}c.restore();
  }
  function crew(c,x,y,s,who,poseName,tm,opt){
    if(typeof aile14CizPoz==='function')aile14CizPoz(c,x,y,s,who,poseName,tm,opt||{});
    else { // Only an integration-safe fallback until the astronaut module loads.
      oval(c,x,y-40*s,17*s,26*s,who==='anne'?'#d5c8e8':'#afd3e8');oval(c,x,y-72*s,19*s,19*s,'#c9e7ed');oval(c,x,y-72*s,12*s,13*s,'#edc9b3');
    }
  }
  function crewPhase(who,distance,speed){const cycle=window.AILE14&&typeof AILE14.cycleDistance==='function'?AILE14.cycleDistance(who,speed):(who==='anne'?72:48);return distance/Math.max(1,cycle)*TAU;}
  function landingGear(c,deploy){
    if(deploy<.01)return;for(const side of [-1,1]){const x=side<0?-87:79,fx=x+side*21*deploy,fy=20+27*deploy;path(c,[[x,15],[lerp(x,fx,.6),fy-8],[fx,fy]],'#48637f',5);path(c,[[x+2,17],[lerp(x,fx,.6)+1,fy-9]],'#b7cdd5',2);oval(c,lerp(x,fx,.6),fy-8,4,4,'#d7dfdb');round(c,fx-18,fy-2,36,5,2,'#344f6d');path(c,[[fx-13,fy-2],[fx+13,fy-2]],'#a1c3cb',1);}
  }
  function shipWake(o,tm){
    if(!o.wake||o.phase==='board'||o.phase==='unboard')return;g.save();for(let j=1;j<o.wake.length;j++){const a=o.wake[j-1],b=o.wake[j];if(a.age<0||b.age<0||b.age<a.age||b.age-a.age>.11)continue;const age=o.age-b.age;if(age>2.5)continue;g.globalAlpha=(1-age/2.5)*.12;g.lineWidth=1+age*3.2;g.strokeStyle=j%2?'#c6dfdf':'#c2bce3';g.beginPath();g.moveTo(a.x,a.y);g.quadraticCurveTo((a.x+b.x)*.5,(a.y+b.y)*.5+Math.sin(tm*.8+j)*2,b.x,b.y);g.stroke();}g.restore();
  }
  function shipDraw(o,tm,front){
    warm();const flying=activeFlight===o,x=flying?o.fx:(Number.isFinite(o.x0)?o.x0:o.x)+38,y=flying?o.fy:720,roll=flying?o.roll||0:0;
    if(!flying&&o.done)return;if(!visible(x,430))return;
    const moving=flying&&(o.phase==='coast'||o.phase==='lift'||o.phase==='land'),boarding=flying&&o.phase==='board',exiting=flying&&o.phase==='unboard',boardU=boarding?ease(o.t/2.6):1;
    const gear=!flying||boarding||exiting?1:o.phase==='lift'?1-ease(o.t/1.5):o.phase==='land'?ease((o.t-.25)/2.65):0;
    if(!front){if(flying)shipWake(o,tm);if(y>620){g.save();g.globalAlpha=sat((y-620)/100)*.17;oval(g,x,721,162,10,'#153354');g.restore();}}
    g.save();g.translate(x,y-48);g.rotate(roll);
    if(!front){
      landingGear(g,gear);
      if(moving){const pulse=.95+Math.sin(tm*8)*.05;g.save();g.globalAlpha=.5;g.translate(-208,-13);g.scale(pulse,1);g.drawImage(atlas.halo,-160,-46,180,90);g.fillStyle='#b8e4e5';g.beginPath();g.moveTo(0,-13);g.bezierCurveTo(-31,-17,-65,-8,-91+Math.sin(tm*4)*5,0);g.bezierCurveTo(-57,8,-28,14,0,12);g.fill();g.fillStyle='#f2e9ba';g.beginPath();g.moveTo(0,-6);g.quadraticCurveTo(-35,-8,-58+Math.sin(tm*5)*3,0);g.quadraticCurveTo(-33,7,0,6);g.fill();g.restore();}
      g.drawImage(atlas.ship,-235,-183,480,280);
      if(flying){
        const seats=[[-61,-20],[12,-22]],exitU=exiting?ease(o.t/3):0;
        for(let j=0;j<2;j++){
          const who=j?'feza':'anne',sx=j?0:boarding&&Number.isFinite(o.motherOffset)?o.motherOffset:-90,u=boarding?ease((o.t-(j?1.3:0))/(j?1.6:1.4)):exiting?ease((o.t-(j?0:1.25))/(j?1.3:1.55)):1;
          let xx=seats[j][0],yy=seats[j][1],sc=.65;
          if(boarding){if(u<.52){const q=ease(u/.52);xx=lerp(sx,-145,q);yy=lerp(48,25,q);sc=lerp(1,.78,q);}else{const q=ease((u-.52)/.48);xx=lerp(-145,seats[j][0],q);yy=lerp(25,seats[j][1],q);sc=lerp(.78,.65,q);}}
          else if(exiting){if(u<.45){const q=ease(u/.45);xx=lerp(seats[j][0],-145,q);yy=lerp(seats[j][1],25,q);sc=lerp(.65,.78,q);}else{const q=ease((u-.45)/.55);xx=lerp(-145,sx,q);yy=lerp(25,48,q);sc=lerp(.78,1,q);}}
          const seatU=boarding?ease((u-.52)/.48):exiting?1-ease(u/.45):1,L1=Math.hypot(-145-sx,-23),L2=Math.hypot(seats[j][0]+145,seats[j][1]-25),travel=boarding?(u<.52?Math.hypot(xx-sx,yy-48):L1+Math.hypot(xx+145,yy-25)):exiting?(u<.45?Math.hypot(xx-seats[j][0],yy-seats[j][1]):L2+Math.hypot(xx+145,yy-25)):0;
          crew(g,xx,yy,sc,who,'otur',tm,{yon:boarding&&u<.52||exiting&&u<.45?-1:1,smile:.83,hiz:boarding||exiting?65:0,walk:1-seatU,poseU:seatU,phase:crewPhase(who,travel,65),gazeX:.4,gazeY:-.05,golge:false});
        }
        compass(g,99,-55,.33,.8);
      }
    }else{
      if(flying){g.save();g.globalAlpha=.075;g.fillStyle='#c5e6e7';g.beginPath();g.ellipse(-22,-61,91,57,-.08,0,TAU);g.fill();g.globalAlpha=.42;path(g,[[-91,-88],[-71,-105],[-44,-112]],'#f4ffff',3);path(g,[[-76,-77],[-59,-94]],'#f4ffff',1.5);g.restore();}
      if(!flying||boarding||exiting){const u=boarding?1-ease((o.t-1)/1.6):exiting?ease(o.t/.65):1;g.save();g.globalAlpha=u;path(g,[[-134,7],[-177,40],[-213,47]],'#bdccd5',7);path(g,[[-139,0],[-184,29],[-218,38]],'#617d9c',2.3);for(let j=0;j<4;j++)path(g,[[-146-j*16,14+j*8],[-156-j*16,21+j*8]],'#edf0df',1.4);g.restore();}
      const light=flying?.72+.12*Math.sin(tm*1.4):.6;g.save();g.globalAlpha=light;oval(g,169,-13,4,3,'#d2eee4');g.restore();
    }g.restore();
  }
  function releaseFlight(o,interrupted){
    if(P.ucus===o){P.ucus=null;P.x=P.safeX=interrupted?o.fx:o.inisX;P.y=P.safeY=720;P.vx=P.vy=0;P.ground=true;P.dj=true;P.buf=0;P.kilit=0;}
    if(activeFlight===o)activeFlight=null;viewState.insideShip=false;o.phase=interrupted?'wait':'done';
    if(window.AILE14&&typeof AILE14.anchor==='function')AILE14.anchor(P.x-90,720,1);
    if(!interrupted){o.done=true;V14.voyage=(V14.voyage||0)+1;ev('k14VoyageDone',{from:o.from,to:o.to,o,stars:o.stars.filter(q=>q.done).length});ev('ucusBitti',{o});}
  }
  function startFlight(o){
    if(o.done||P.ucus||DURUM!=='oyun')return;
    const mother=window.AILE14&&typeof AILE14.state==='function'?AILE14.state():null;o.motherOffset=mother&&mother.hazir&&Number.isFinite(mother.x)?mother.x-P.x:-90;
    o.phase='board';o.t=0;o.u=0;o.sx=P.x;o.sy=P.y;o.fx=P.x;o.fy=720;o.aim=0;o.roll=0;o.lastPulse=-1;o.ready=true;o.age=0;o.wakeT=0;if(o.wake)for(const p of o.wake)p.age=-1;
    activeFlight=o;P.ucus=o;P.kilit=0;P.vx=P.vy=0;P.ground=true;P.buf=0;hand.on=false;
    ev('k14VoyageStart',{from:o.from,to:o.to,o});
  }
  function flightStep(o,dt,U){
    dt=validDt(dt);if(!dt||DURUM!=='oyun'||P.ucus!==o)return;o.t+=dt;o.age+=dt;const px=o.fx,py=o.fy;
    if(o.phase==='board'){o.fx=lerp(o.sx,o.x0+38,ease(o.t/2.6));o.fy=720;if(o.t>=3.2){o.phase='lift';o.t=0;}}
    else if(o.phase==='lift'){o.fx=o.x0+38+ease(o.t/3)*130;o.fy=720-ease(o.t/3)*235;if(o.t>=3){o.phase='coast';o.t=0;}}
    else if(o.phase==='coast'){
      const held=!!(U&&(U.basili||U.eksenY||U.eksenX));o.u=sat(o.u+dt/(held?19.8:22.2));
      let aim=0;if(U&&U.basili&&Number.isFinite(U.hedefY))aim=clamp(U.hedefY-440,-110,110);else if(U&&U.eksenY)aim=U.eksenY*104;
      o.aim=lerp(o.aim,aim,1-Math.exp(-dt*3.4));o.fx=lerp(o.x0+168,o.inisX-155,o.u);o.fy=475+o.aim+Math.sin(o.t*.9)*9;
      for(let j=0;j<o.stars.length;j++){const q=o.stars[j];q.pop=Math.max(0,q.pop-dt*1.7);if(!q.done&&Math.hypot(o.fx-q.x,o.fy-30-q.y)<118){q.done=true;q.pop=1;stats.flightStars++;sparkle(q.x,q.y,9,j%4);ev('k14VoyageStar',{from:o.from,to:o.to,index:j});}}
      if(o.u>=1){o.phase='land';o.t=0;o.landX=o.fx;o.landY=o.fy;}
    }else if(o.phase==='land'){
      const u=ease(o.t/3.2);o.fx=lerp(o.landX,o.inisX,u);o.fy=lerp(o.landY,720,u);if(o.t>=3.2){o.phase='unboard';o.t=0;}
    }else if(o.phase==='unboard'){o.fx=o.inisX;o.fy=720;if(o.t>=3){releaseFlight(o,false);return;}}
    o.roll=lerp(o.roll,clamp((o.fy-py)/dt*.0011,-.11,.11),1-Math.exp(-dt*3));
    o.x=o.fx;if(o.wake&&(o.phase==='lift'||o.phase==='coast'||o.phase==='land')){o.wakeT+=dt;if(o.wakeT>=.07){o.wakeT=0;const p=o.wake[o.wakeHead++%o.wake.length];p.x=o.fx-205;p.y=o.fy-61;p.age=o.age;}}P.x=o.fx;P.y=o.fy;P.vx=(o.fx-px)/dt;P.vy=(o.fy-py)/dt;P.f=1;P.ground=true;
    D.x=lerp(D.x,o.fx+153,1-Math.exp(-dt*3));D.y=lerp(D.y,o.fy-130+Math.sin(time*1.8)*13,1-Math.exp(-dt*3));D.f=1;
  }
  function flightStars(o,tm){
    if(activeFlight!==o||o.phase==='board')return;g.save();
    for(let j=0;j<o.stars.length;j++){const q=o.stars[j];if(!visible(q.x,120)||q.done&&q.pop<=0)continue;g.save();g.globalAlpha=q.done?q.pop:.65;const r=18+Math.sin(tm*1.5+q.k)*1.5;
      if(j<o.stars.length-1){const n=o.stars[j+1];g.save();g.globalAlpha*=.19;g.setLineDash([2,13]);g.strokeStyle=COLORS[q.k];g.lineWidth=1.3;g.beginPath();g.moveTo(q.x+30,q.y);g.bezierCurveTo(q.x+120,q.y-35,n.x-120,n.y+35,n.x-28,n.y);g.stroke();g.restore();}
      g.strokeStyle=COLORS[q.k];g.lineWidth=1.5;g.beginPath();g.arc(q.x,q.y,31+q.pop*18,-.9+tm*.07,.9+tm*.07);g.stroke();g.beginPath();g.arc(q.x,q.y,31+q.pop*18,Math.PI-.9+tm*.07,Math.PI+.9+tm*.07);g.stroke();
      star(g,q.x,q.y,r,'#fff0c3',tm*.06);star(g,q.x,q.y,r*.46,'#fff8de',tm*.06);g.restore();
    }g.restore();
  }
  function launchDraw(o,tm){
    if(!visible(o.x,260))return;g.save();g.translate(o.x,720);round(g,-140,-16,280,21,9,'#91aabe');round(g,-108,-37,216,21,6,'#b9ccda');
    for(let j=0;j<3;j++){const u=.5+.5*Math.sin(tm*1.9-j*.8),x=-70+j*70;oval(g,x,-58,15,15,o.ready?'#d8efad':'#83abc1');g.globalAlpha=.15+.35*u;g.drawImage(atlas.halo,x-40,-95,80,65);g.globalAlpha=1;}
    compass(g,0,-155,.85,1);g.restore();
  }
  function initToy(o){
    o.world=clamp(o.world|0,0,3);o.kind=clamp(o.kind|0,0,2);o.sira=o.world*3+o.kind;o.u=0;o.t=0;o.started=false;o.done=false;o.nearT=0;o.helpT=0;o.pop=0;o.cd=0;o.manual=0;o.assisted=0;o.lastInput=-99;o.finishT=0;o.replay=0;o.engaged=false;o.encountered=false;o.welcomeAt=-99;
    o.parts=[];o.marks=[];o.trail=[];o.notes=Array.from({length:5},()=>({hit:false,a:0,h:0,v:0}));
    if(o.world===0&&o.kind===0){const homes=[[-175,-35],[175,-35],[-160,-185],[170,-190]],slots=[[-75,-32],[75,-32],[42,-119],[-40,-118]];for(let j=0;j<4;j++)o.parts.push({x:o.x+homes[j][0],y:720+homes[j][1],hx:o.x+homes[j][0],hy:720+homes[j][1],tx:o.x+slots[j][0],ty:720+slots[j][1],done:false,t:0,k:j});o.rover={x:o.x,target:o.x+200,u:0,angle:0,drive:false,ready:false,readyT:0,cue:0};}
    if(o.world===0&&o.kind===2){o.photo=0;o.flash=0;for(let j=0;j<4;j++)o.marks.push({x:o.x-175+j*100,y:720-[170,285,245,155][j],hit:false,pop:0});}
    if(o.world===1&&o.kind===0){o.dust=[1,1,1,1,1];o.open=0;}
    if(o.world===1&&o.kind===1){o.rover={x:o.x-240,y:680,target:o.x-240,v:0,angle:0,active:false};o.found=0;o.sniff=0;o.rock={x:o.x-170,y:674,pop:0,fromX:o.x-170,toX:o.x-170,hopT:0,arc:0};}
    if(o.world===1&&o.kind===2){o.dunes=[0,0,0];o.flag=0;o.flagTarget=0;o.wind=1;o.shelterReady=false;}
    if(o.world===2&&o.kind===0){for(let j=0;j<3;j++)o.parts.push({x:o.x+(j-1)*60,y:720-340+j*88,hx:o.x+(j-1)*60,hy:720-340+j*88,tx:o.x,ty:720-170-j*92,done:false,t:0,k:j});o.banded=0;}
    if(o.world===2&&o.kind===1){o.sail={x:o.x-235,y:510,targetY:510,v:0,vx:0,u:0,run:false,roll:0,next:0,waiting:false,cheer:0,wind:0};for(let j=0;j<4;j++)o.marks.push({x:o.x-180+j*120,y:720-[220,310,240,325][j],hit:false,pop:0});}
    if(o.world===2&&o.kind===2){o.swirl=0;o.lastAngle=null;o.calm=0;o.stormAngle=0;}
    if(o.world===3&&o.kind===0){for(let j=0;j<4;j++)o.marks.push({x:o.x-210+j*140,y:720-[160,260,320,210][j],hit:false,pop:0});o.drawn=0;o.aurora=0;}
    if(o.world===3&&o.kind===1){o.nest=0;o.nestTarget=0;}
    if(o.world===3&&o.kind===2){o.puck={x:o.x-220,y:652,vx:0,vy:0,targetX:o.x-220,targetY:652,active:false,travel:0,trail:Array.from({length:32},()=>({x:0,y:0,t:-10})),trailHead:0,trailT:0};for(let j=0;j<4;j++)o.marks.push({x:o.x-140+j*85,y:720-[78,130,100,125][j],hit:false,pop:0});}
    toys.push(o);
  }
  function firstAction(o){
    let x=o.x,y=590;
    if(o.parts.length){const p=o.parts.find(p=>!p.done);if(p){x=p.x;y=p.y;}else{x=o.world===0?o.rover.x:o.x;y=650;}}
    else if(o.world===0&&o.kind===1){let j=o.notes.slice(0,4).findIndex(n=>!n.hit);if(j<0)j=0;x=o.x-174+j*116;y=669+o.notes[j].h;}
    else if(o.world===0&&o.kind===2){const q=o.marks.find(q=>!q.hit);x=q?q.x:o.x+210;y=q?q.y:628;}
    else if(o.world===1&&o.kind===0){let j=o.dust.findIndex(d=>d>.01);if(j<0)j=2;x=!o.engaged?o.x-263:o.x-180+j*90;y=!o.engaged?558:606-Math.sin(j*Math.PI/4)*53;}
    else if(o.world===1&&o.kind===1){x=o.rock.x;y=642;}
    else if(o.world===1&&o.kind===2){let j=o.dunes.findIndex(d=>d<.97);x=j<0?o.x+100:o.x-170+j*170;y=j<0?530:661;}
    else if(o.world===2&&o.kind===1){const q=o.sail.run&&o.marks.find(q=>!q.hit);x=q?q.x:o.sail.x;y=q?q.y:o.sail.y;}
    else if(o.world===2&&o.kind===2){x=o.x+105;y=505;}
    else if(o.world===3&&o.kind===0){const q=o.marks.find(q=>!q.hit);if(q){x=q.x;y=q.y;}}
    else if(o.world===3&&o.kind===1){let j=o.notes.findIndex(n=>!n.hit);if(j<0)j=0;x=o.x-200+j*100;y=535+j%2*35;}
    else if(o.world===3&&o.kind===2){x=o.puck.x;y=o.puck.y-20;}
    focusPoint.x=x;focusPoint.y=y;return focusPoint;
  }
  function nextStageCue(o){return o.world===0&&o.kind===0&&o.rover.ready&&!o.rover.drive||o.world===0&&o.kind===2&&!o.photo&&o.marks.every(q=>q.hit)||o.world===1&&o.kind===2&&o.shelterReady&&!o.flagTarget||o.world===1&&o.kind===1&&o.found>0&&o.found<3&&Math.abs(o.rover.target-(o.rock.hopT>0?o.rock.toX:o.rock.x))>65||o.world===2&&o.kind===1&&o.sail.waiting;}
  function beginEncounter(o,playing=false){
    const q=firstAction(o);encounter.o=o;encounter.phase=playing?'play':'welcome';encounter.start=encounter.phaseStart=time;encounter.age=encounter.phaseAge=0;encounter.stopX=o.x-300;encounter.targetX=q.x;encounter.targetY=q.y;encounter.hold=!playing;o.encountered=true;o.welcomeAt=time;buddy.joy=.8;viewState.activity=o;startToy(o);ev('k14EncounterStart',{o,world:o.world,kind:o.kind,targetX:q.x,targetY:q.y,phase:encounter.phase});
  }
  function changeEncounter(phase){if(!encounter.o)return;encounter.phase=phase;encounter.phaseStart=time;encounter.phaseAge=0;encounter.hold=phase==='welcome';}
  function freshWalkIntent(){if(encounter.o&&encounter.phase==='welcome')changeEncounter('skip');}
  function encounterStep(){
    if(!encounter.o)return;const o=encounter.o;encounter.age=time-encounter.start;encounter.phaseAge=time-encounter.phaseStart;const q=firstAction(o);encounter.targetX=q.x;encounter.targetY=q.y;
    if(o.done&&encounter.phase!=='celebrate')changeEncounter('celebrate');
    else if(encounter.phase==='welcome'&&encounter.age>5)changeEncounter('invite');
    if(Math.abs(P.x-o.x)>1000||P.ucus){encounter.o=null;encounter.phase='none';encounter.hold=false;}
  }
  function walkControl(axis){
    if(!encounter.o||encounter.phase!=='welcome'||!encounter.hold)return 1;
    if(axis<0||P.ground===false){changeEncounter('skip');return 1;}if(!axis)return 1;
    return sat((encounter.stopX-P.x)/160);
  }
  function startToy(o){if(!o.started){o.started=true;ev('k14ActivityStart',{world:o.world,kind:o.kind,o});}viewState.activity=o;}
  function touchToy(o,assisted=false){
    if(!assisted){o.engaged=true;if(encounter.o!==o)beginEncounter(o,true);else if(encounter.phase!=='play')changeEncounter('play');}
    startToy(o);o.lastInput=time;o.pop=1;if(!assisted){buddy.joy=1;ev('k14ActivityTouch',{world:o.world,kind:o.kind,o});}o.helpT=0;if(assisted){o.assisted++;stats.assisted++;}else{o.manual++;stats.manual++;}
    if(o.done){o.replay++;stats.replayed++;}pose('uzan',{sure:1.2,worldX:o.x,worldY:590,reach:.7});
  }
  function markToy(o,j,assisted=false){
    const q=o.marks[j];if(!q||q.hit)return;q.hit=true;q.pop=1;sparkle(q.x,q.y,8,o.world);ring(q.x,q.y,o.world,22);ev('k14ActivityStep',{world:o.world,kind:o.kind,o,u:o.u,part:j,assisted});
  }
  function solvePart(o,j){const p=o.parts[j];if(!p||p.done)return;p.sx=p.x;p.sy=p.y;p.done=true;p.t=0;ring(p.tx,p.ty,o.world,22);sparkle(p.tx,p.ty,8,o.world);ev('k14ActivityStep',{world:o.world,kind:o.kind,o,part:j,u:o.u});}
  function completeToy(o){
    if(o.done)return;o.done=true;o.u=1;o.finishT=0;o.pop=1;V14.activity=(V14.activity||0)+1;
    if(!Array.isArray(V14.seals))V14.seals=[false,false,false,false];V14.seals[o.world]=toys.filter(q=>q.world===o.world&&q.done).length===3;
    if(o.world===3&&o.kind===2)V14.reunited=true;
    buddy.joy=1;pose('sevinc',{sure:2.4});sparkle(o.x,565,22,o.world);ring(o.x,565,o.world,80);ev('k14ActivityDone',{world:o.world,kind:o.kind,o,manual:o.manual,assisted:o.assisted,seal:V14.seals[o.world]});
  }
  function closestMark(o,x,y){let j=-1,d=Infinity;for(let k=0;k<o.marks.length;k++){const q=o.marks[k],n=Math.hypot(q.x-x,q.y-y);if(!q.hit&&n<d){d=n;j=k;}}return d<110?j:-1;}
  function craterHit(o,j,assisted=false){
    j=clamp(j|0,0,3);const q=o.notes[j];if(time-(q.lastHit??-99)<.12)return;q.lastHit=time;q.a=1;if(q.h>-55)q.v=Math.min(q.v,-280);
    if(!q.hit){q.hit=true;ring(o.x-174+j*116,686,0,42);sparkle(o.x-174+j*116,671,8,0);ev('k14ActivityStep',{world:0,kind:1,o,part:j,u:o.u,assisted});}else ev('k14ActivityStep',{world:0,kind:1,o,part:j,u:o.u,assisted,replay:true});
    if(!P.ucus&&Math.abs(P.x-(o.x-174+j*116))<155&&P.y>560){P.vy=Math.min(P.vy,-620);P.ground=false;P.dj=true;P.buf=0;P.bounce=true;P.jumpT=0;P.coyote=0;P.air=0;pose('zipla',{sure:1.4});}
  }
  function solarBrush(o,x,y,strength){
    const j=clamp(Math.round((x-(o.x-180))/90),0,4),previous=o.dust[j];const dust=Math.max(0,o.dust[j]-strength);o.dust[j]=dust<.12?0:dust;
    if(previous>o.dust[j])ev('k14ActivityStep',{world:1,kind:0,o,part:j,u:1-o.dust.reduce((a,b)=>a+b,0)/5,partial:o.dust[j]>0});
    if(o.dust[j]===0&&!o.notes[j].hit){o.notes[j].hit=true;o.notes[j].a=1;sparkle(o.x-180+j*90,580,6,1);}
  }
  function duneStroke(o,x,amount){const j=clamp(Math.round((x-(o.x-170))/170),0,2),old=o.dunes[j],height=sat(o.dunes[j]+amount);o.dunes[j]=height>=.92?1:height;if(o.dunes[j]>old)ev('k14ActivityStep',{world:1,kind:2,o,part:j,u:o.u,partial:true});if(o.dunes[j]>.98&&!o.notes[j].hit){o.notes[j].hit=true;o.notes[j].a=1;ring(o.x-170+j*170,654,1,36);}}
  function swirlStroke(o,x,y,moved){
    const a=Math.atan2(y-505,x-o.x),r=Math.hypot(x-o.x,y-505);if(r<35||r>185)return;
    if(moved&&o.lastAngle!==null){let d=a-o.lastAngle;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;o.swirl+=Math.min(.45,Math.abs(d));}else o.swirl+=.34;
    o.lastAngle=a;addTrail(o,x,y);o.calm=sat(o.swirl/(TAU*1.1));if(o.manual===1||Math.floor(o.calm*6)>Math.floor((o.u||0)*6)){sparkle(x,y,4,2);ev('k14ActivityStep',{world:2,kind:2,o,u:o.calm});}
  }
  function actToy(o,x,y,phase='tap',dx=0,dy=0,assisted=false){
    touchToy(o,assisted);const moved=phase==='move';
    if(o.world===0&&o.kind===0){
      if(o.parts.every(q=>q.done&&q.t>.95)){o.rover.drive=true;o.rover.target=clamp(x,o.x-170,o.x+200);if(phase!=='move')o.rover.target=o.done&&o.rover.x>o.x+20?o.x-150:o.x+200;}
      else if(!moved){let j=o.parts.findIndex(q=>!q.done&&Math.hypot(q.x-x,q.y-y)<92);if(j<0)j=o.parts.findIndex(q=>!q.done);if(j>=0){hand.part=j;if(assisted||phase==='key')solvePart(o,j);}}
    }else if(o.world===0&&o.kind===1){const j=clamp(Math.round((x-(o.x-174))/116),0,3);craterHit(o,j,assisted);}
    else if(o.world===0&&o.kind===2){const j=closestMark(o,x,y);if(j>=0)markToy(o,j,assisted);else if(!moved&&o.marks.every(q=>q.hit)){o.photo=1;o.flash=1;pose('el_salla',{sure:2});}else if(!moved){const k=o.marks.findIndex(q=>!q.hit);if(k>=0)markToy(o,k,assisted);}}
    else if(o.world===1&&o.kind===0){let bx=x;if(!moved&&x<o.x-225){let j=o.dust.findIndex(d=>d>.01);if(j<0)j=2;bx=o.x-180+j*90;}solarBrush(o,bx,y,moved?Math.min(.45,Math.hypot(dx,dy)*.014):.52);}
    else if(o.world===1&&o.kind===1){const destination=o.rock.hopT>0?o.rock.toX:o.rock.x;o.rover.active=true;o.rover.searchDistance=Math.max(45,Math.abs(o.rover.x-destination));o.rover.target=phase!=='move'&&(Math.abs(x-o.rover.x)<85||Math.abs(x-o.rock.x)<65)?destination:clamp(x,o.x-240,o.x+240);if(assisted)o.rover.target=destination;}
    else if(o.world===1&&o.kind===2){if(o.dunes.every(v=>v>.97)){if(!moved&&o.flagTarget===0){o.flagTarget=1;ev('k14ActivityStep',{world:1,kind:2,o,part:3,u:o.u});pose('uzan',{sure:1.2});}}else{let sx=x;if(y<575){const j=o.dunes.findIndex(v=>v<.98);sx=o.x-170+Math.max(0,j)*170;}duneStroke(o,sx,moved?Math.min(.25,Math.hypot(dx,dy)*.012):.38);}}
    else if(o.world===2&&o.kind===0){if(!moved){let j=o.parts.findIndex(q=>!q.done&&Math.abs(q.y-y)<60);if(j<0)j=o.parts.findIndex(q=>!q.done);hand.part=j;if(assisted||phase==='key')solvePart(o,j);}}
    else if(o.world===2&&o.kind===1){const p=o.sail;if(p.u>=1&&phase!=='move'){p.u=0;p.x=o.x-235;p.y=p.targetY=510;p.v=p.vx=p.roll=p.next=p.cheer=0;p.waiting=false;for(const q of o.marks){q.hit=false;q.pop=0;}}const q=o.marks.find(q=>!q.hit),onTarget=q&&Math.hypot((x-q.x)/76,(y-q.y)/84)<1,onBoat=Math.hypot(x-p.x,y-p.y)<94;p.run=true;p.targetY=!moved&&q&&(onTarget||onBoat&&p.waiting)?q.y:clamp(y,365,600);}
    else if(o.world===2&&o.kind===2)swirlStroke(o,x,y,moved);
    else if(o.world===3&&o.kind===0){const j=closestMark(o,x,y);if(j>=0)markToy(o,j,assisted);if(moved){o.drawn+=Math.hypot(dx,dy);addTrail(o,x,y);}else{const k=o.marks.findIndex(q=>!q.hit);if(j<0&&k>=0)markToy(o,k,assisted);o.drawn+=70;}}
    else if(o.world===3&&o.kind===1){let j=clamp(Math.round((x-(o.x-200))/100),0,4);if(o.notes[j].hit&&!o.done){const n=o.notes.findIndex(q=>!q.hit);if(n>=0)j=n;}o.notes[j].hit=true;o.notes[j].a=1;ring(o.x-200+j*100,535+j%2*35,3,32);ev('k14ActivityStep',{world:3,kind:1,o,part:j,u:o.u,assisted});}
    else if(o.world===3&&o.kind===2){const p=o.puck,handle=phase!=='move'&&Math.hypot(x-p.x,y-(p.y-20))<95,next=o.marks.find(q=>!q.hit);p.active=true;p.targetX=handle?(next?next.x:o.x+235):clamp(x,o.x-250,o.x+260);p.targetY=handle?(next?next.y:610):clamp(y,560,676);if(moved){p.vx=clamp(p.vx+dx*3,-420,420);p.vy=clamp(p.vy+dy*2,-260,260);}if(assisted){p.targetX=o.x+235;p.targetY=610;}}
  }
  function addTrail(o,x,y){if(o.trail.length>=48)o.trail.shift();o.trail.push({x,y,t:3.5});}
  function helpToy(o){o.demoUntil=time+3.5;const q=firstAction(o);ev('k14DemoStart',{o,world:o.world,kind:o.kind,targetX:q.x,targetY:q.y});}
  function stepToy(o,dt){
    dt=validDt(dt);if(!dt||DURUM!=='oyun')return;o.t+=dt;o.pop=Math.max(0,o.pop-dt*1.5);o.cd=Math.max(0,o.cd-dt);if(o.done)o.finishT+=dt;
    for(const n of o.notes){n.a=Math.max(0,n.a-dt*1.4);if(o.world===0&&o.kind===1&&(n.h<0||n.v!==0)){n.v+=450*dt;n.h+=n.v*dt;if(n.h>=0){n.h=0;n.v=n.v>35?-n.v*.16:0;}if(n.h< -160){n.h=-160;n.v=Math.max(0,n.v);}}}for(const q of o.marks)q.pop=Math.max(0,q.pop-dt*1.2);for(const p of o.parts)if(p.done){p.t=Math.min(1,p.t+dt*2.4);p.x=lerp(p.sx,p.tx,ease(p.t));p.y=lerp(p.sy,p.ty,ease(p.t));}
    if(!o.done&&!o.encountered&&!P.ucus&&P.ground&&P.vx>35&&P.x>=o.x-540&&P.x<o.x-140)beginEncounter(o,false);
    if(!(o.world===3&&o.kind===0))for(let j=o.trail.length-1;j>=0;j--){o.trail[j].t-=dt;if(o.trail[j].t<=0)o.trail.splice(j,1);}
    const isNear=near(o,580)&&!P.ucus;if(isNear){o.nearT+=dt;o.helpT+=dt;if(!o.done&&o.engaged&&o.nearT>18&&o.helpT>10&&time-o.lastInput>9){o.helpT=0;helpToy(o);}}else{o.nearT=0;o.helpT=0;}
    if(o.world===0&&o.kind===0){const count=o.parts.filter(q=>q.done).length;if(count===4){const r=o.rover,settled=o.parts.every(q=>q.t>.95);if(settled&&!r.ready){r.ready=true;r.readyT=0;r.cue=1;ev('k14RoverReady',{o});}if(r.ready)r.readyT+=dt;r.cue=Math.max(0,r.cue-dt*.65);if(r.drive&&settled){const px=r.x;r.x=lerp(r.x,r.target,1-Math.exp(-dt*1.7));r.angle+=(r.x-px)/26;r.u=Math.max(r.u,sat((r.x-o.x)/200));}o.u=.65+r.u*.35;if(r.u>.98)completeToy(o);}else o.u=count/4*.65;}
    else if(o.world===0&&o.kind===1){o.u=o.notes.slice(0,4).filter(q=>q.hit).length/4;if(o.u>=1)completeToy(o);}
    else if(o.world===0&&o.kind===2){const count=o.marks.filter(q=>q.hit).length;o.flash=Math.max(0,o.flash-dt*.8);o.u=count/4*.75+o.photo*.25;if(o.photo&&count===4)completeToy(o);}
    else if(o.world===1&&o.kind===0){o.open=lerp(o.open,o.dust.every(v=>v<.02)?1:0,1-Math.exp(-dt*2));o.u=1-o.dust.reduce((a,b)=>a+b,0)/5;if(o.u>.995&&o.open>.95)completeToy(o);}
    else if(o.world===1&&o.kind===1){const r=o.rover,px=r.x;r.v=lerp(r.v,clamp((r.target-r.x)*3,-125,125),1-Math.exp(-dt*3));r.x+=r.v*dt;r.angle+=(r.x-px)/23;o.rock.pop=Math.max(0,o.rock.pop-dt*1.2);if(o.rock.hopT>0){o.rock.hopT=Math.max(0,o.rock.hopT-dt);const h=ease(1-o.rock.hopT/.9);o.rock.x=lerp(o.rock.fromX,o.rock.toX,h);o.rock.arc=Math.sin(h*Math.PI)*85;}else o.rock.arc=0;if(o.engaged&&r.active&&o.rock.hopT<=0&&o.found<3&&Math.abs(r.x-o.rock.x)<36){o.sniff+=dt;if(o.sniff>.65){o.found++;o.sniff=0;o.rock.pop=1;sparkle(o.rock.x,642,9,1);ev('k14ActivityStep',{world:1,kind:1,o,part:o.found,u:o.found/3});if(o.found<3){o.rock.fromX=o.rock.x;o.rock.toX=o.x+[-170,180,-25][o.found];o.rock.hopT=.9;r.searchDistance=Math.max(45,Math.abs(r.x-o.rock.toX));}}}else o.sniff=0;const search=r.active&&o.rock.hopT<=0?sat(1-Math.abs(r.x-o.rock.x)/(r.searchDistance||70)):0;o.u=o.found>=3?1:(o.found+Math.min(.24,search*.24))/3;if(o.found>=3)completeToy(o);}
    else if(o.world===1&&o.kind===2){const d=o.dunes.reduce((a,b)=>a+b,0)/3,ready=o.dunes.every(v=>v>.97);if(ready&&!o.shelterReady){o.shelterReady=true;ev('k14DuneReady',{o,world:1,kind:2});}o.flag=lerp(o.flag,o.flagTarget,1-Math.exp(-dt*1.9));o.wind=lerp(o.wind,1-d*.8,1-Math.exp(-dt*2));o.u=d*.8+o.flag*.2;if(ready&&o.flag>.96)completeToy(o);}
    else if(o.world===2&&o.kind===0){o.u=o.parts.filter(q=>q.done).length/3;o.banded=lerp(o.banded,o.u,1-Math.exp(-dt*1.7));if(o.u>=1&&o.parts.every(q=>q.t>.95))completeToy(o);}
    else if(o.world===2&&o.kind===1){const p=o.sail;p.cheer=Math.max(0,p.cheer-dt*.8);if(p.run){const next=o.marks.findIndex(q=>!q.hit),q=next<0?null:o.marks[next];p.next=next<0?4:next;if(!q)p.targetY=510;p.v+=((p.targetY-p.y)*18-p.v*8)*dt;p.y=clamp(p.y+p.v*dt,355,610);const aligned=!q||Math.abs(q.y-p.y)<48,destination=q?q.x+(aligned?25:-28):o.x+260;p.vx=lerp(p.vx,clamp((destination-p.x)*1.6,0,46),1-Math.exp(-dt*3.8));p.x+=p.vx*dt;p.waiting=!!q&&Math.abs(q.x-p.x)<48&&!aligned;p.roll=lerp(p.roll,clamp(p.v*.0018,-.22,.22),1-Math.exp(-dt*4));p.wind=lerp(p.wind,p.waiting?.22:1,1-Math.exp(-dt*3));if(q&&Math.abs(p.x-q.x)<30&&Math.abs(p.y-q.y)<48){markToy(o,next);p.cheer=1;p.waiting=false;p.next=Math.min(4,next+1);}p.u=sat((p.x-(o.x-235))/495);if(!q&&p.x>o.x+235){p.u=1;p.run=false;p.waiting=false;completeToy(o);}}const count=o.marks.filter(q=>q.hit).length;o.u=o.done?1:count/4*.82+p.u*.18;}
    else if(o.world===2&&o.kind===2){o.stormAngle+=dt*(.42-o.calm*.32);o.u=o.calm;if(o.u>=.995)completeToy(o);}
    else if(o.world===3&&o.kind===0){for(let j=o.trail.length-1;j>=0;j--){o.trail[j].t-=dt;if(o.trail[j].t<=0)o.trail.splice(j,1);}const count=o.marks.filter(q=>q.hit).length;o.aurora=lerp(o.aurora,count/4,1-Math.exp(-dt*1.8));o.u=count/4*.8+Math.min(1,o.drawn/240)*.2;if(count===4&&o.drawn>=240)completeToy(o);}
    else if(o.world===3&&o.kind===1){const count=o.notes.filter(q=>q.hit).length;if(count===5)o.nestTarget=1;o.nest=lerp(o.nest,o.nestTarget,1-Math.exp(-dt*1.3));o.u=o.done?1:count/5*.7+o.nest*.3;if(count===5)completeToy(o);}
    else if(o.world===3&&o.kind===2){const p=o.puck;if(p.active){const px=p.x,py=p.y;p.vx+=((p.targetX-p.x)*2.6-p.vx*.7)*dt;p.vy+=((p.targetY-p.y)*2.6-p.vy*.8)*dt;p.vx=clamp(p.vx,-330,330);p.vy=clamp(p.vy,-200,200);p.x=clamp(p.x+p.vx*dt,o.x-260,o.x+260);p.y=clamp(p.y+p.vy*dt,550,680);p.travel+=Math.hypot(p.x-px,p.y-py);p.trailT+=dt;if(p.trailT>.065&&Math.hypot(p.x-px,p.y-py)>.05){p.trailT=0;const q=p.trail[p.trailHead++%p.trail.length];q.x=p.x;q.y=p.y;q.t=o.t;}for(let j=0;j<o.marks.length;j++){const q=o.marks[j];if(!q.hit&&Math.hypot(p.x-q.x,p.y-q.y)<50)markToy(o,j);}if(p.travel>220&&p.x>o.x+205&&Math.abs(p.y-610)<70)completeToy(o);}o.u=o.done?1:Math.min(.92,p.travel/500*.6+o.marks.filter(q=>q.hit).length/4*.32);}
  }
  function base(c,x,y,w=300,col='#7592aa'){
    oval(c,x,y+3,w*.6,12,'rgba(10,21,43,.2)');round(c,x-w*.5,y-17,w,22,9,'#405978');round(c,x-w*.5+7,y-20,w-14,11,5,col);path(c,[[x-w*.45,y-17],[x+w*.45,y-17]],'#c0dae4',1.4);
    for(let j=0;j<3;j++)oval(c,x+(j-1)*w*.32,y-6,3,3,'#9cd3dc');
  }
  function wheel(c,x,y,r,angle=0,tint='#7e9cb5'){
    oval(c,x,y,r,r,'#293b53');oval(c,x,y,r*.81,r*.81,tint);oval(c,x,y,r*.56,r*.56,'#40536e');
    c.save();c.translate(x,y);c.rotate(angle);for(let j=0;j<12;j++){const a=j*TAU/12;path(c,[[Math.cos(a)*r*.88,Math.sin(a)*r*.88],[Math.cos(a+.1)*r*.98,Math.sin(a+.1)*r*.98]],'#4a6278',1.4);if(j%2===0)path(c,[[Math.cos(a)*r*.22,Math.sin(a)*r*.22],[Math.cos(a)*r*.66,Math.sin(a)*r*.66]],'#b8d2df',1.7);}oval(c,0,0,r*.19,r*.19,'#e8eadf');c.restore();
  }
  function roverHead(c,x,y,awake=1,tm=0){
    c.save();c.translate(x,y);round(c,-37,-13,74,28,9,'#dce6dd');round(c,-33,7,66,7,4,'#a6bec3');path(c,[[-29,-9],[-19,-11],[25,-11],[31,-7]],'#f1efda',1.5);path(c,[[-33,-4],[-33,5]],'#8eaab4',1.2);oval(c,-32,9,1.2,1.2,'#698a9b');oval(c,32,9,1.2,1.2,'#698a9b');const blink=tm>0&&(tm+1.8)%4.7<.13?.14:1,eye=(.18+.82*awake)*blink;oval(c,-15,0,8,8*eye,'#355c75');oval(c,14,0,8,8*eye,'#355c75');if(eye>.4){oval(c,-17,-2,2,2,'#eff6e9');oval(c,12,-2,2,2,'#eff6e9');}if(awake>.5){c.strokeStyle='#779a9f';c.lineWidth=1.2;c.beginPath();c.moveTo(-4,8);c.quadraticCurveTo(0,11,5,8);c.stroke();}c.restore();
  }
  function rover(c,x,y,s=1,angle=0,complete=true,mars=false,awake=1,tm=0){
    c.save();c.translate(x,y);c.scale(s,s);
    if(complete){wheel(c,-73,-17,27,angle,mars?'#c5a18d':'#88afbf');wheel(c,72,-17,27,angle,mars?'#c5a18d':'#88afbf');}
    path(c,[[-72,-21],[-52,-48],[48,-48],[72,-20]],'#536985',8);for(const side of [-1,1]){const x=side*62;path(c,[[x,-22],[x-side*11,-31],[x+side*4,-37],[x-side*9,-44]],'#b5c6ca',2);oval(c,x,-22,4.5,4.5,'#e4ded1');}round(c,-82,-68,164,45,14,mars?'#d99c7c':'#d0dfdf');round(c,-76,-34,152,10,5,mars?'#b57d69':'#91aebc');c.fillStyle=mars?'#bc826a':'#a6bdc5';c.beginPath();c.moveTo(68,-64);c.quadraticCurveTo(81,-61,81,-51);c.lineTo(80,-37);c.quadraticCurveTo(78,-29,68,-27);c.lineTo(68,-64);c.fill();round(c,-68,-63,136,12,5,mars?'#edd0aa':'#e9eadb');path(c,[[-70,-58],[-64,-65],[58,-65],[70,-58]],mars?'#f3d9b8':'#f1efe0',1.4);path(c,[[-69,-43],[67,-43]],'#8faab6',1.2);for(let j=0;j<5;j++)round(c,-59+j*25,-39,14,7,2,j===0?'#dfc88f':'#7899aa');for(const x of [-73,73]){oval(c,x,-58,2,2,'#829ba9');oval(c,x,-34,2,2,'#829ba9');}path(c,[[-46,-49],[-46,-27]],mars?'#ba886e':'#a0b8c0',.8);path(c,[[44,-49],[44,-27]],mars?'#ba886e':'#a0b8c0',.8);
    round(c,-54,-103,100,34,9,'#496f8b');round(c,-48,-99,88,23,4,'#638fa6');path(c,[[-47,-100],[35,-100],[42,-95]],'#a5c9cf',1.2);path(c,[[-49,-76],[39,-76]],'#355d79',2);for(let j=0;j<4;j++)path(c,[[-45+j*23,-98],[-45+j*23,-78]],'#a7c6ce',1.3);path(c,[[-47,-88],[39,-88]],'#8db2c3',.9);for(const x of [-49,41])oval(c,x,-73,1.3,1.3,'#bdd4d1');
    if(complete){path(c,[[42,-69],[47,-122],[62,-134]],'#acb9c6',4);oval(c,65,-138,10,10,awake>.7?'#e8d89e':'#baaf94');path(c,[[59,-143],[62,-146],[67,-145]],'#f5e7b5',1.2);if(awake>0){c.save();c.globalAlpha=awake*.16;oval(c,65,-138,15,15,'#ffe3a1');c.restore();}path(c,[[-40,-71],[-43,-118]],'#8097af',4);roverHead(c,-40,-101,awake,tm);}
    c.restore();
  }
  function moonRoverDraw(o,tm){
    const built=o.parts.every(q=>q.done&&q.t>.95),r=o.rover;g.save();base(g,o.x,720,400,'#8b9eac');
    if(!built){rover(g,o.x,704,1,0,false);
      // Each landing silhouette matches its loose part. A quiet pulse makes the
      // two upper sockets as readable as the wheels, without arrows or labels.
      for(const p of o.parts){if(p.done)continue;const selected=hand.on&&hand.o===o&&hand.part===p.k;g.save();g.globalAlpha=selected?.9:.58+.12*Math.sin(tm*1.9+p.k*.4);g.strokeStyle=selected?'#ffe7b0':'#d9e8dc';g.lineWidth=selected?2.4:1.9;g.setLineDash([4,4]);
        if(p.k<2){g.beginPath();g.arc(p.tx,p.ty,31,0,TAU);g.stroke();g.beginPath();g.arc(p.tx,p.ty,7,0,TAU);g.stroke();}
        else if(p.k===2){path(g,[[p.tx,p.ty+24],[p.tx,p.ty-21],[p.tx+16,p.ty-32]],selected?'#ffe7b0':'#d9e8dc',2.3);g.beginPath();g.arc(p.tx+18,p.ty-36,12,0,TAU);g.stroke();}
        else{round(g,p.tx-37,p.ty-13,74,28,9,'rgba(218,236,224,.10)');g.stroke();g.beginPath();g.arc(p.tx-15,p.ty,8,0,TAU);g.stroke();g.beginPath();g.arc(p.tx+14,p.ty,8,0,TAU);g.stroke();}
        g.restore();}

      for(const p of o.parts){g.save();g.translate(p.x,p.y);const float=p.done?0:Math.sin(tm*1.7+p.k)*4;g.translate(0,float);if(p.k<2)wheel(g,0,0,27,tm*.2);else if(p.k===2){path(g,[[0,24],[0,-21],[16,-32]],'#cbd6df',5);oval(g,18,-36,11,11,'#e7d59c');path(g,[[12,-41],[16,-44],[21,-42]],'#f4e9bc',1.3);}else roverHead(g,0,0,1,tm);if(!p.done){g.strokeStyle=COLORS[0];g.globalAlpha=.4+.2*Math.sin(tm*2+p.k);g.lineWidth=1.4;g.beginPath();g.ellipse(0,0,45,45,0,0,TAU);g.stroke();}g.restore();}
    }else{const wake=ease((r.readyT||0)/.9),cheer=(1-ease((r.readyT||0)/2.2))*Math.sin((r.readyT||0)*9),cue=r.drive?0:(r.cue||0);rover(g,r.x,704+cheer*1.8,1,r.angle+cheer*.12,true,false,wake,tm);if(!r.drive){g.save();g.globalAlpha=(.22+.12*Math.sin(tm*2.2))*wake;path(g,[[r.x-63,674],[r.x+59,674]],'#fff0c8',2.5);g.restore();}g.strokeStyle='rgba(202,221,223,.4)';g.lineWidth=2;g.setLineDash([3,12]);g.beginPath();g.moveTo(o.x-190,710);g.quadraticCurveTo(o.x,681,o.x+205,710);g.stroke();g.setLineDash([]);for(let j=0;j<3;j++){const x=o.x+65+j*62;g.save();g.globalAlpha=r.x>x?.8:.48+.22*Math.sin(tm*2.2-j*.8)+cue*.1;star(g,x,663+Math.sin(tm*1.8-j*.8)*3,7,r.x>x?'#ffe8a0':'#c7d7cd');g.restore();}}
    g.restore();
  }
  function craterDraw(o,tm){
    g.save();for(let j=0;j<4;j++){const x=o.x-174+j*116,q=o.notes[j],bounce=q.a;oval(g,x,705,56,13,'#526074');oval(g,x,699,53,14,'#9ba8b4');oval(g,x,696,40,10,'#6c8098');oval(g,x,693,32,8,q.hit?'#d5dfcf':'#acb7c1');path(g,[[x-31,697],[x,699-bounce*7],[x+31,697]],q.hit?COLORS[0]:'#d8e2df',2);
      const yy=669+q.h;path(g,[[x-42,702],[x-53,699],[x-47,696]],'#c6d0cf',1);path(g,[[x+43,700],[x+52,698],[x+47,695]],'#c6d0cf',1);oval(g,x,yy,17,19,q.hit?'#e9ead4':'#b3c2cd');oval(g,x-6,yy-3,3,4,'#456178');oval(g,x+6,yy-3,3,4,'#456178');path(g,[[x-11,yy-12],[x-3,yy-16],[x+7,yy-12]],'#f2edce',1.3);if(bounce>0){g.globalAlpha=bounce;g.strokeStyle=COLORS[0];g.lineWidth=2;for(let k=0;k<2;k++){g.beginPath();g.ellipse(x,690-bounce*21-k*20,40+bounce*18+k*12,9+bounce*3,0,0,TAU);g.stroke();}g.globalAlpha=1;}}
    if(o.done)for(let j=0;j<3;j++)star(g,o.x+(j-1)*40,535+Math.sin(tm*1.2+j)*7,5,COLORS[0],tm*.08);g.restore();
  }
  function photoDraw(o,tm){
    g.save();base(g,o.x,720,330,'#91aabb');
    g.strokeStyle='#a8bfd0';g.lineWidth=3;g.setLineDash([4,8]);g.beginPath();for(let j=0;j<o.marks.length;j++){const q=o.marks[j];j?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y);}g.stroke();g.setLineDash([]);
    for(const q of o.marks){oval(g,q.x,q.y,31,31,q.hit?'rgba(255,232,170,.18)':'rgba(166,205,227,.11)');star(g,q.x,q.y,15+q.pop*7,q.hit?'#ffedb5':'#9eb9cd',tm*.06);if(!q.hit){g.strokeStyle='rgba(222,236,236,.5)';g.lineWidth=1.4;g.beginPath();g.arc(q.x,q.y,34+Math.sin(tm*2)*3,0,TAU);g.stroke();}}
    path(g,[[o.x+180,709],[o.x+208,638],[o.x+232,708]],'#859cb1',5);round(g,o.x+171,598,77,50,12,'#d9e5e6');round(g,o.x+178,603,62,14,5,'#f2edda');oval(g,o.x+210,628,22,22,'#5d7b9b');oval(g,o.x+210,628,15,15,'#294c70');const align=o.marks.filter(q=>q.hit).length;for(let j=0;j<4;j++)oval(g,o.x+184+j*17,607,2.7,2.7,j<align?'#ffdfa2':'#7b96ab');for(let j=0;j<5;j++){const a=j*TAU/5+align*.12;path(g,[[o.x+210+Math.cos(a)*10,o.y-92+Math.sin(a)*10],[o.x+210+Math.cos(a+.35)*(4+align),o.y-92+Math.sin(a+.35)*(4+align)]],'#7896b1',1.2);}oval(g,o.x+205,621,5,5,'#91d0db');
    if(o.marks.every(q=>q.hit)){const p=.5+.5*Math.sin(tm*2.5);oval(g,o.x+210,597,10+p*3,10+p*3,'#ffdfa2');}
    if(o.photo){g.save();g.globalAlpha=Math.min(1,o.finishT*.8+.25);g.strokeStyle='#dbe8e0';g.lineWidth=5;g.fillStyle='rgba(32,60,82,.18)';g.fillRect(o.x-135,461,250,145);g.fillStyle='#ebeee0';g.fillRect(o.x-147,449,260,157);g.fillStyle='#455f7c';g.fillRect(o.x-140,456,246,142);g.strokeRect(o.x-142,454,250,145);if(!(typeof DN14!=='undefined'&&typeof DN14.drawEarth==='function'&&DN14.drawEarth(g,o.x-15,520,55))){oval(g,o.x-15,520,55,55,'#6aabca');oval(g,o.x-35,510,17,23,'#9cc397');oval(g,o.x+3,539,23,12,'#b7d5ad');}crew(g,o.x-73,582,.49,'anne','el_salla',tm,{yon:1,smile:1});crew(g,o.x+50,584,.46,'feza','el_salla',tm,{yon:-1,smile:1});g.restore();}
    if(o.flash>0){g.globalAlpha=o.flash*.32;g.drawImage(atlas.halo,o.x-260,360,520,330);}g.restore();
  }
  function solarDraw(o,tm){
    g.save();base(g,o.x,720,445,'#b99c8e');path(g,[[o.x,704],[o.x,625]],'#7f958c',11);path(g,[[o.x,700],[o.x,625]],'#c0d0b4',3);
    for(let j=0;j<5;j++){const x=o.x-180+j*90,d=o.dust[j],yy=606-Math.sin(j*Math.PI/4)*53;path(g,[[o.x,677],[x,yy+22]],'#698f8c',6);g.save();g.translate(x,yy);g.rotate((j-2)*(.06+o.open*.09)+Math.sin(tm*.8+j)*o.open*.035);oval(g,0,32,8,8,'#b9cfc8');round(g,-40,-39,80,75,12,'#d5e5d9');round(g,-34,-34,68,61,6,'#558db0');for(let n=1;n<4;n++)path(g,[[-32+n*16,-31],[-32+n*16,24]],'#9ac9d5',1.2);path(g,[[-33,-4],[33,-4]],'#d6d9ac',1.2);
      if(d>.001){g.globalAlpha=d;g.fillStyle='#bd7357';g.beginPath();g.moveTo(-35,-28);g.quadraticCurveTo(-18,-39,-3,-29);g.quadraticCurveTo(15,-38,34,-28);g.lineTo(29,-8);g.quadraticCurveTo(39,9,26,25);g.lineTo(4,21);g.quadraticCurveTo(-18,32,-35,18);g.lineTo(-28,-2);g.closePath();g.fill();for(let n=0;n<15;n++){const a=n*2.399+ j;oval(g,Math.cos(a)*(8+n*1.4),Math.sin(a)*(5+n*.8),2.5,1.5,n%2?'#d99a6b':'#9c5c49');}g.globalAlpha=1;}
      if(d>.05){g.save();g.beginPath();g.moveTo(-32,28);g.lineTo(-18,28);g.lineTo(31,-32);g.lineTo(17,-32);g.closePath();g.clip();round(g,-34,-34,68,61,6,'#4f8eaf');for(let n=1;n<4;n++)path(g,[[-32+n*16,-31],[-32+n*16,24]],'#d6d9ac',1.3);path(g,[[-33,-4],[33,-4]],'#d6d9ac',1.3);g.restore();}
      if(o.notes[j].a>.02){g.save();g.globalAlpha=o.notes[j].a*.45;for(let k=0;k<5;k++){const age=1-o.notes[j].a;oval(g,(k-2)*9+age*(k-2)*20,-15-age*56+(k%2)*8,3-age*1.7,1.4,'#dba27b');}g.restore();}if(encounter.o===o&&!o.engaged&&Math.abs(encounter.targetX-x)<12){g.save();g.globalAlpha=.35+.2*Math.sin(tm*2.2);path(g,[[-31,-28],[-21,-33],[-10,-27]],'#ffe7b1',2.4);g.restore();}if(d<.4){g.save();g.globalAlpha=(1-d)*(.4+.15*Math.sin(tm*2+j));star(g,24,-23,7,'#fff0ad',tm*.1);g.restore();}g.restore();}
    path(g,[[o.x-263,704],[o.x-263,633]],'#9e9c92',4);round(g,o.x-277,630,28,10,4,'#d2c4a7');g.save();g.translate(o.x-263,559);g.rotate(-.2+(!o.engaged?Math.sin(tm*1.4)*.025:0));path(g,[[0,4],[0,70]],'#b89067',11);path(g,[[-2,8],[-2,65]],'#e4c995',2);round(g,-22,-18,44,35,7,'#e7d3a7');round(g,-20,1,40,11,3,'#89bdb6');for(let n=0;n<7;n++)path(g,[[-17+n*5,-15],[-17+n*5,-2]],'#c5a77c',1.3);g.restore();oval(g,o.x,664,20,20,'#738f8d');oval(g,o.x,661,15,15,o.engaged?'#ead8a4':'#ffe5a8');star(g,o.x,661,8,'#b29b76',.15);if(o.open>.01){const u=o.open;g.save();g.globalAlpha=u*.35;g.fillStyle='#bee4df';g.beginPath();g.ellipse(o.x,700,132,112*u,0,Math.PI,TAU);g.lineTo(o.x+132,703);g.lineTo(o.x-132,703);g.closePath();g.fill();g.globalAlpha=u*.7;g.strokeStyle='#d4eee2';g.lineWidth=1.5;g.beginPath();g.ellipse(o.x,700,132,112*u,0,Math.PI,TAU);g.stroke();g.restore();for(let j=0;j<3;j++){const x=o.x+(j-1)*75;path(g,[[x,702],[x,702-u*(65+j%2*27)]],'#75ae91',4);oval(g,x-9*u,686-u*20,12*u,5*u,'#91c6a2',-.5);oval(g,x+9*u,684-u*20,12*u,5*u,'#6eaa8c',.5);const fy=700-u*(75+j%2*27)-o.pop*Math.sin(tm*3+j)*3;for(let k=0;k<5;k++){const a=k*TAU/5+tm*.045+o.pop*Math.sin(tm*2+j)*.12;oval(g,x+Math.cos(a)*8*u,fy+Math.sin(a)*8*u,6*u,4*u,k%2?'#f2c79a':'#ecc0b0',a);}oval(g,x,fy,4.2*u,4.2*u,'#f6e4a7');}}g.restore();
  }
  function marsRoverDraw(o,tm){
    g.save();base(g,o.x,720,580,'#be8b72');g.strokeStyle='#cfab8a';g.globalAlpha=.5;g.lineWidth=2;g.setLineDash([2,11]);g.beginPath();g.moveTo(o.x-250,704);g.quadraticCurveTo(o.x-70,682,o.x+245,704);g.stroke();g.setLineDash([]);g.globalAlpha=1;
    for(let j=0;j<5;j++){const x=o.x-215+j*105;g.fillStyle=j%2?'#a96c59':'#c18a6b';g.beginPath();g.moveTo(x-32,707);g.lineTo(x-26,680-j%2*13);g.quadraticCurveTo(x-5,664,x+18,680);g.lineTo(x+37,707);g.closePath();g.fill();path(g,[[x-17,681],[x-8,688],[x+14,684]],'#d7a17c',2);}
    rover(g,o.rover.x,704,.64,o.rover.angle,true,true);
    const r=o.rock,yy=673-r.arc-(o.found>=3&&r.pop>0?Math.sin((1-r.pop)*Math.PI)*43:0);g.save();g.translate(r.x,yy);g.rotate(Math.sin(tm*2)*.04*(o.found>=3?1:.2));g.fillStyle='#d99c7b';g.beginPath();g.moveTo(-29,26);g.lineTo(-34,-4);g.lineTo(-15,-28);g.lineTo(14,-30);g.lineTo(34,-2);g.lineTo(29,25);g.closePath();g.fill();path(g,[[-28,-2],[-12,-20],[12,-21],[28,-1]],'#edbd93',3);oval(g,-10,-1,3.5,4.8,'#544d55');oval(g,10,-1,3.5,4.8,'#544d55');g.strokeStyle='#6d5a5c';g.lineWidth=1.7;g.beginPath();g.arc(0,8,6,.1,Math.PI-.1);g.stroke();if(o.found<3){g.globalAlpha=.4+.2*Math.sin(tm*2.3);star(g,0,-47,9,'#ffe7b0',tm*.1);}g.restore();
    for(let j=0;j<3;j++)star(g,o.x-36+j*36,493,8,o.found>j?'#ffdda2':'#835f59');g.restore();
  }
  function dunesDraw(o,tm){
    g.save();base(g,o.x,720,610,'#c39278');for(let j=0;j<3;j++){const x=o.x-170+j*170,u=o.dunes[j];g.fillStyle='#bd7857';g.beginPath();g.moveTo(x-107,717);g.quadraticCurveTo(x-20,690-u*84,x+20,700-u*100);g.quadraticCurveTo(x+71,701-u*66,x+116,717);g.closePath();g.fill();g.fillStyle='#dba071';g.beginPath();g.moveTo(x-94,716);g.quadraticCurveTo(x-22,692-u*83,x+19,703-u*99);g.quadraticCurveTo(x+2,711-u*51,x-94,716);g.fill();
      oval(g,x,698-u*58,15,6,'#e6d0a9');path(g,[[x-5,696-u*58],[x+5,696-u*58]],'#a17d68',1.3);if(u<.98){g.strokeStyle='rgba(255,214,157,.6)';g.lineWidth=3;g.beginPath();g.moveTo(x-60,681);g.quadraticCurveTo(x,649-u*35,x+60,681);g.stroke();star(g,x,660-u*30,7,'#f8d39c');}}
    for(let j=0;j<3;j++){const x=o.x-170+j*170,u=o.dunes[j];for(let k=0;k<4;k++){g.strokeStyle=k%2?'rgba(248,202,149,.27)':'rgba(133,88,78,.2)';g.lineWidth=1.2;g.beginPath();g.moveTo(x-73+k*4,710-k*7);g.quadraticCurveTo(x-10,685-u*63+k*3,x+67-k*4,708-k*4);g.stroke();}}if(o.flagTarget===0){g.save();g.translate(o.x+102,510);const flap=o.shelterReady?Math.sin(tm*2.3)*5:0;g.fillStyle='#a6dcd0';g.beginPath();g.moveTo(0,0);g.lineTo(42,16+flap);g.lineTo(12,34);g.lineTo(0,20);g.closePath();g.fill();path(g,[[2,5],[25,17+flap],[10,27]],'#e7edca',1.3);oval(g,8,32,7,7,o.shelterReady?'#ffe5a6':'#b7c9ad');g.restore();}const u=o.flag;path(g,[[o.x+100,700],[o.x+100,495]],'#9f9ca6',5);g.save();g.translate(o.x+102,500);g.scale(Math.max(.02,u),1);const wave=Math.sin(tm*2.2)*(6+o.pop*5),hem=Math.sin(tm*2.2-.9)*(8+o.pop*5);g.fillStyle='#a0d7ce';g.beginPath();g.moveTo(0,0);g.bezierCurveTo(42,-14+wave,69,24+hem,112,7+wave);g.lineTo(110,70+hem);g.bezierCurveTo(73,84+wave,39,41+hem,0,59);g.closePath();g.fill();path(g,[[5,9],[45,14+wave],[100,18+wave]],'#d6f0d8',2);star(g,49,31+wave*.35,14,'#f5ebc1');g.restore();
    for(let j=0;j<16;j++){const u1=(tm*.17+j*.063)%1,x=o.x-340+u1*680,y=601+Math.sin(j*1.9+tm*2)*25;g.globalAlpha=.16+o.wind*.25;oval(g,x,y,4,1.2,'#f4c190');}g.globalAlpha=1;
    if(o.flag>.75){star(g,o.x-15,625+Math.sin(tm*1.8)*5,10,'#fff0bd',tm*.05);star(g,o.x-38,640,3,'#efcfaa');star(g,o.x+10,639,3,'#efcfaa');}g.restore();
  }
  function cloudRibbon(c,x,y,w,col,phase,kind=0,ghost=false){
    c.save();c.translate(x,y);c.scale(1,kind===1?.78:kind===2?1.12:1);if(ghost){c.globalAlpha*=.22;c.setLineDash([5,5]);}c.fillStyle=col;c.beginPath();c.moveTo(-w*.5,7);c.bezierCurveTo(-w*.55,-12,-w*.32,-31,-w*.2,-17);c.bezierCurveTo(-w*.09,-39,w*.08,-24,w*.18,-30);c.bezierCurveTo(w*.39,-43,w*.47,-9,w*.5,0);c.bezierCurveTo(w*.58,27,w*.13,32,-w*.15,26);c.quadraticCurveTo(-w*.44,30,-w*.5,7);c.fill();if(ghost){c.globalAlpha*=2.5;c.strokeStyle=col;c.lineWidth=1.4;c.stroke();c.restore();return;}path(c,[[-w*.39,0],[-w*.13,-6+Math.sin(phase)*2],[w*.16,-3],[w*.37,1]],'rgba(255,248,225,.44)',3);path(c,[[-w*.39,17],[-w*.08,24],[w*.25,19],[w*.44,13]],'rgba(83,72,104,.17)',2.4);for(let k=0;k<3;k++){c.strokeStyle='rgba(255,247,221,.22)';c.lineWidth=1;c.beginPath();c.moveTo(-w*.32+k*w*.18,-7-k%2*5);c.bezierCurveTo(-w*.13+k*w*.1,-19,w*.05+k*w*.1,3,w*.22+k*w*.05,-5);c.stroke();}c.restore();
  }
  function bandsDraw(o,tm){
    g.save();base(g,o.x,720,370,'#9ca7c1');path(g,[[o.x-175,701],[o.x-175,332],[o.x+175,332],[o.x+175,701]],'#7183a1',5);oval(g,o.x,504,177,187,'rgba(185,207,227,.08)');
    for(const p of o.parts){if(!p.done)cloudRibbon(g,p.tx,p.ty,[245,270,225][p.k],['#eeddbd','#d99f89','#b38f9d'][p.k],0,p.k,true);}
    for(let layer=0;layer<2;layer++)for(const p of o.parts){if(p.done!==(layer===0))continue;cloudRibbon(g,p.x,p.y+o.pop*Math.sin(tm*3+p.k)*3,[245,270,225][p.k],[ '#eeddbd','#d99f89','#b38f9d'][p.k],tm,p.k);if(!p.done){oval(g,p.x-102,p.y-2,12,12,'#f6e6c2');g.globalAlpha=.4+.2*Math.sin(tm*2+p.k);oval(g,p.x-102,p.y-2,21,21,'#d8e7e5');g.globalAlpha=1;}}
    if(o.banded>.8){const u=ease((o.banded-.8)/.2);for(let j=0;j<3;j++)star(g,o.x+(j-1)*38,466+Math.sin(tm*1.4+j)*6,(4+j%2*2)*u,'#f5e4c1',tm*.07);}g.restore();
  }
  function sailDraw(o,tm){
    g.save();base(g,o.x-260,720,110,'#9fa4bc');base(g,o.x+260,720,110,'#9fa4bc');
    path(g,[[o.x+260,705],[o.x+260,563]],'#8698b1',7);path(g,[[o.x+263,701],[o.x+263,566]],'#b9c8d2',1.6);oval(g,o.x+260,562,71,9,'#829bb5');oval(g,o.x+260,558,68,7,'#c6d8d6');for(const side of [-1,1]){path(g,[[o.x+260+side*55,558],[o.x+260+side*68,541]],'#bcced3',3);oval(g,o.x+260+side*68,540,3,3,'#e6dbac');}
    const p=o.sail,next=o.marks.findIndex(q=>!q.hit);path(g,[[o.x-260,705],[o.x-260,653]],'#9ea8bb',5);oval(g,o.x-260,647,19,19,'#7d8da9');g.save();g.translate(o.x-260,647);g.rotate(tm*(p.run&&!p.waiting?3.6:.6));path(g,[[-13,0],[13,0]],'#e8d6aa',4);path(g,[[0,-13],[0,13]],'#e8d6aa',4);oval(g,13,0,5,5,'#fff0c9');g.restore();
    g.save();g.globalAlpha=.3;g.strokeStyle='#ded2d8';g.lineWidth=1.5;g.setLineDash([2,11]);g.beginPath();g.moveTo(o.x-235,510);for(const q of o.marks)g.lineTo(q.x,q.y);g.lineTo(o.x+260,510);g.stroke();g.restore();
    for(let j=0;j<o.marks.length;j++){const q=o.marks[j],active=j===next,pulse=.5+.5*Math.sin(tm*2.1);g.globalAlpha=q.hit?.25:active?1:.55;g.beginPath();g.ellipse(q.x,q.y,34+q.pop*10,58+q.pop*10,0,0,TAU);g.strokeStyle='#665675';g.lineWidth=5.5;g.stroke();g.strokeStyle=q.hit?'#f8e2aa':active?'#f8dfab':'#d2b9de';g.lineWidth=2.5;g.stroke();star(g,q.x,q.y,active?11+pulse:9,q.hit?'#fff1bc':active?'#fff0bf':'#d2b4df');g.strokeStyle='#665675';g.lineWidth=3;g.stroke();g.fill();if(active){for(const side of [-1,1]){g.save();g.globalAlpha=.55+.25*pulse;oval(g,q.x+side*22,q.y-42,3,3,'#fff0bd');g.restore();}}}g.globalAlpha=1;
    g.save();g.translate(p.x,p.y);g.rotate(p.roll);oval(g,0,48,59,7,'rgba(112,133,165,.16)');path(g,[[-62,17],[58,17]],'#8e9dbb',9);g.fillStyle='#b1b8d4';g.beginPath();g.moveTo(-67,11);g.quadraticCurveTo(0,46,66,9);g.lineTo(50,30);g.quadraticCurveTo(0,60,-48,31);g.closePath();g.fill();path(g,[[0,18],[0,-119]],'#d1dce2',4);const billow=Math.sin(tm*2.2)*3+(p.wind||0)*5;g.fillStyle='#f3dba9';g.beginPath();g.moveTo(5,-114);g.quadraticCurveTo(74+billow,-87,78,-25);g.quadraticCurveTo(39+billow,-45,5,-20);g.closePath();g.fill();path(g,[[11,-101],[62,-37]],'#e0bfa0',2);path(g,[[5,-109],[27+billow*.6,-63],[5,-23]],'#fff0cf',1.1);path(g,[[0,-113],[-47,21],[58,21]],'#b6c5d1',1.4);path(g,[[-49,32],[0,43],[49,31]],'#d3deed',1.4);for(const x of [-42,-20,4,27,46])oval(g,x,31,1.7,1.7,'#748ca9');g.save();g.globalAlpha=.45;path(g,[[6,-80],[35,-65],[5,-50]],'#eec59d',1.5);g.restore();g.save();g.translate(-42,20);g.rotate(tm*(.8+(p.vx||0)*.045));oval(g,0,0,10,10,'#9aa9bf');for(let j=0;j<4;j++){g.rotate(TAU/4);path(g,[[0,-3],[0,-10]],'#dfd5b7',2);}g.restore();g.save();g.translate(0,-122);g.rotate(Math.sin(tm*7)*p.cheer*.28);path(g,[[0,-3],[0,8]],'#e9d5aa',1.7);oval(g,0,10,6,5,'#dfc995');oval(g,0,14,7,2,'#b69f84');g.restore();comet(g,-12,(!p.run||p.waiting?Math.sin(tm*1.7)*3:0)-Math.sin((1-p.cheer)*Math.PI)*p.cheer*9,.52,.8+p.cheer*.2,tm,0,-.6);g.restore();
    if(next>=0){const q=o.marks[next],pulse=.5+.5*Math.sin(tm*2.1);g.save();g.beginPath();g.ellipse(q.x,q.y,34,58,0,-Math.PI/2,Math.PI/2);g.strokeStyle='#665675';g.lineWidth=5.5;g.stroke();g.strokeStyle='#f8dfab';g.lineWidth=2.5;g.stroke();star(g,q.x,q.y,11+pulse,'#fff0bf');g.strokeStyle='#665675';g.lineWidth=3;g.stroke();g.fill();g.restore();}
    for(let j=0;j<3;j++){g.strokeStyle='rgba(218,208,233,.25)';g.lineWidth=2;g.beginPath();const x=o.x-300+(tm*55+j*170)%600;g.moveTo(x,380+j*92);g.bezierCurveTo(x+40,353+j*92,x+70,401+j*92,x+108,374+j*92);g.stroke();}g.restore();
  }
  function stormDraw(o,tm){
    g.save();base(g,o.x,720,326,'#a5aabc');path(g,[[o.x-83,701],[o.x-66,664],[o.x+66,664],[o.x+83,701]],'#879db4',7);path(g,[[o.x-42,701],[o.x-36,679],[o.x+36,679],[o.x+42,701]],'#c6d7d7',2.5);
    oval(g,o.x,519,159,158,'#69859e');oval(g,o.x,512,153,153,'#c3cbd0');
    g.save();g.beginPath();g.ellipse(o.x,512,147,147,0,0,TAU);g.clip();g.fillStyle='#e8d4b7';g.fillRect(o.x-150,360,300,305);
    const drift=o.stormAngle+o.pop*.16;for(let j=0;j<8;j++){const y=371+j*39;g.fillStyle=['#d5a38f','#e8c4a3','#b68a91','#dfb99b'][j%4];g.beginPath();g.moveTo(o.x-160,y);g.bezierCurveTo(o.x-76,y-16+Math.sin(drift+j)*9,o.x+45,y+19,o.x+160,y-6);g.lineTo(o.x+160,y+32);g.bezierCurveTo(o.x+35,y+41,o.x-72,y+24,o.x-160,y+37);g.closePath();g.fill();}
    g.save();g.translate(o.x+11,520);g.rotate(-.17);oval(g,0,0,110,65,'#c68f82');
    for(let j=0;j<11;j++){const a=j*.67+drift*.55,rx=105-j*7.2,ry=58-j*3.8;g.strokeStyle=['#e7b69a','#b7777d','#d69a88','#efc7a7'][j%4];g.lineWidth=3.6-j*.1;g.beginPath();for(let k=0;k<=40;k++){const u=k/40,theta=a+u*TAU*.89,r=1-u*.13,xx=Math.cos(theta)*rx*r+Math.sin(theta*3+j)*4,yy=Math.sin(theta)*ry*r+Math.sin(theta*2+j)*3;k?g.lineTo(xx,yy):g.moveTo(xx,yy);}g.stroke();}g.restore();g.restore();
    g.strokeStyle='#acc4d0';g.lineWidth=4;g.beginPath();g.arc(o.x,512,153,0,TAU);g.stroke();g.strokeStyle='rgba(249,252,233,.7)';g.lineWidth=4;g.beginPath();g.arc(o.x-1,511,144,3.66,4.73);g.stroke();g.lineWidth=1.3;g.beginPath();g.arc(o.x,512,137,.22,1.1);g.stroke();
    for(let j=0;j<3;j++){oval(g,o.x-27+j*27,685,3.5,3.5,o.u>(j+1)/4?'#d5e9c7':'#738caa');}
    round(g,o.x+110,594,33,18,7,'#d4c9a9');path(g,[[o.x+116,603],[o.x+137,603]],'#8d9cac',2);for(let j=1;j<o.trail.length;j++){const a=o.trail[j-1],b=o.trail[j];g.save();g.globalAlpha=sat(b.t/3.5)*.3;path(g,[[a.x,a.y],[b.x,b.y]],'#f4d6ae',2.1);g.restore();}if(!o.done){g.save();g.globalAlpha=.27+.08*Math.sin(tm*1.3);g.strokeStyle='#f5dfb7';g.lineWidth=2;g.beginPath();g.arc(o.x,512,170,tm*.13,tm*.13+1.35);g.stroke();star(g,o.x+Math.cos(tm*.13+1.35)*170,512+Math.sin(tm*.13+1.35)*170,5,'#f5dfb7');g.restore();}
    else{g.save();g.globalAlpha=ease(o.finishT/2);oval(g,o.x-16,512,4.5,6,'#674858');oval(g,o.x+25,508,4.5,6,'#674858');g.strokeStyle='#795460';g.lineWidth=2;g.beginPath();g.moveTo(o.x-7,535);g.quadraticCurveTo(o.x+7,544,o.x+20,532);g.stroke();g.restore();}g.restore();
  }

  function crystal(c,x,y,h,w,col,pop=0){
    c.save();c.translate(x,y);c.scale(1+pop*.06,1-pop*.05);c.fillStyle=col;c.beginPath();c.moveTo(-w*.5,0);c.lineTo(-w*.65,-h*.55);c.lineTo(0,-h);c.lineTo(w*.62,-h*.57);c.lineTo(w*.48,0);c.closePath();c.fill();c.fillStyle='rgba(237,255,249,.5)';c.beginPath();c.moveTo(0,-h);c.lineTo(-w*.65,-h*.55);c.lineTo(-w*.1,-h*.45);c.lineTo(0,-h);c.fill();path(c,[[0,-h],[2,-h*.3],[w*.48,0]],'rgba(233,255,253,.5)',1.5);path(c,[[-w*.65,-h*.55],[-w*.1,-h*.45],[w*.62,-h*.57]],'rgba(233,255,253,.35)',1.2);path(c,[[w*.12,-h*.83],[w*.19,-h*.55],[w*.07,-h*.22]],'rgba(233,255,253,.24)',.8);path(c,[[-w*.35,-h*.54],[-w*.24,-h*.32],[-w*.05,-h*.28]],'rgba(233,255,253,.24)',.8);oval(c,-w*.2,-h*.58,1.4,2.4,'rgba(249,255,237,.7)');c.restore();
  }
  function auroraDraw(o,tm){
    g.save();base(g,o.x,720,470,'#9bc5ca');const next=o.marks.findIndex(q=>!q.hit);for(let j=0;j<o.marks.length;j++){const q=o.marks[j];path(g,[[q.x,704],[q.x,q.y+35]],'#7aabbd',4);crystal(g,q.x,q.y+42,92,43,q.hit?'#b3f0e1':'#86b7c6',q.pop);if(q.hit)star(g,q.x,q.y-34,9,'#e7f8d8',tm*.12);else{const active=j===next,pulse=.5+.5*Math.sin(tm*1.8-j*.2);g.save();g.globalAlpha=active?.2+.08*pulse:.12;oval(g,q.x,q.y-3,active?30:23,active?30:23,'#ffe7aa');g.restore();star(g,q.x,q.y-3,active?14+pulse:10,active?'#fff0bd':'#eed9b3',0);oval(g,q.x-1,q.y-5,3.2,3.2,'#fff9df');if(active){oval(g,q.x-19,q.y+10+Math.sin(tm*1.5)*2,3.8,3.8,'#ffe7af');oval(g,q.x+18,q.y-16+Math.sin(tm*1.5+.8)*2,3.2,3.2,'#ffe7af');}}}
    if(o.aurora>.001){g.save();g.globalAlpha=o.aurora*(.76+o.pop*.1);g.drawImage(atlas.curtain,o.x-245+Math.sin(tm*.32)*8,328,490,188);g.globalAlpha=o.aurora*.27;g.drawImage(atlas.curtain,o.x-240-Math.sin(tm*.27)*7,349,480,154);g.globalAlpha=o.aurora*.36;for(let layer=0;layer<3;layer++){g.strokeStyle=['#a1ead5','#b7cef1','#dfbbec'][layer];g.lineWidth=9-layer*2;g.beginPath();for(let j=0;j<=48;j++){const u=j/48,x=o.x-225+u*450,y=398+Math.sin(u*Math.PI*3+tm*.55+layer*.45)*50+layer*13;j?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}g.restore();}
    for(let j=1;j<o.trail.length;j++){const a=o.trail[j-1],b=o.trail[j];g.globalAlpha=sat(b.t/3.5)*.7;path(g,[[a.x,a.y],[b.x,b.y]],COLORS[3],3);}g.globalAlpha=1;if(o.done)for(let j=0;j<3;j++)star(g,o.x+(j-1)*35,465+Math.sin(tm+j)*9,4,'#e5f5d5',tm*.08);g.restore();
  }
  function chimesDraw(o,tm){
    g.save();base(g,o.x,720,440,'#9bc2cc');path(g,[[o.x-245,700],[o.x-220,380],[o.x+220,380],[o.x+245,700]],'#9db9ca',6);path(g,[[o.x-215,386],[o.x+215,386]],'#e4f2e9',2);for(const side of [-1,1]){crystal(g,o.x+side*231,703,61,42,'#a8d9dc');oval(g,o.x+side*218,390,5,5,'#d9efdf');}path(g,[[o.x-120,378],[o.x,365],[o.x+120,378]],'#cde5e1',1.3);
    for(let j=0;j<5;j++){const x=o.x-200+j*100,n=o.notes[j],len=80+j%3*23,y=500+j%2*28,angle=Math.sin(tm*7-j)*n.a*.11;g.save();g.translate(x,386);g.rotate(angle);path(g,[[0,0],[0,y-386]],'#b9dde3',1.7);crystal(g,0,y-386+len,len,40,n.hit?['#b1eddc','#bbdce8','#c9c8ec','#d5cfeb','#a8dedc'][j]:'#80aabf',n.a);g.restore();if(n.a>.01){g.globalAlpha=n.a;g.strokeStyle=COLORS[3];g.lineWidth=1.6;g.beginPath();g.arc(x,y+len*.5,35+(1-n.a)*52,0,TAU);g.stroke();g.globalAlpha=1;}}
    const u=o.nest;oval(g,o.x,698,80,14,'#8bb5c5');g.save();g.translate(o.x,680);g.fillStyle='#a7d8de';g.beginPath();g.moveTo(-80,8);g.quadraticCurveTo(-86,-61,0,-68);g.quadraticCurveTo(90,-55,80,8);g.closePath();g.fill();if(u>.01){g.globalAlpha=u;g.drawImage(atlas.halo,-95,-130,190,130);comet(g,-32,-39-u*41,.65,.9,tm,1);comet(g,32,-42-u*43,.74,.9,tm+1,2);g.globalAlpha=1;}for(let side=-1;side<=1;side+=2){g.save();g.translate(side*u*48,0);g.rotate(side*u*.6);crystal(g,side*35,8,82,74,'#b8e7e7');g.restore();}g.restore();g.restore();
  }
  function glideDraw(o,tm){
    g.save();oval(g,o.x,660,288,57,'#689bac');oval(g,o.x,650,281,54,'#a9d8dc');g.strokeStyle='rgba(226,252,241,.65)';g.lineWidth=2;for(let j=0;j<3;j++){g.beginPath();g.ellipse(o.x,648,270-j*15,46-j*7,0,0,TAU);g.stroke();}
    for(const q of o.marks){g.globalAlpha=q.hit?.3:1;star(g,q.x,q.y,12,q.hit?'#ecf5c6':'#79b9c4',tm*.12);g.strokeStyle='rgba(221,247,231,.6)';g.lineWidth=1.5;g.beginPath();g.arc(q.x,q.y,24,0,TAU);g.stroke();}g.globalAlpha=1;
    const p=o.puck;g.save();g.lineWidth=2;g.strokeStyle='#d9f4e7';for(let j=1;j<p.trail.length;j++){const a=p.trail[j-1],b=p.trail[j],age=o.t-b.t;if(age<0||age>2.5||b.t<a.t||b.t-a.t>.15)continue;g.globalAlpha=(1-age/2.5)*.34;g.beginPath();g.moveTo(a.x,a.y+10);g.lineTo(b.x,b.y+10);g.stroke();}g.restore();oval(g,p.x,p.y+13,41,11,'rgba(42,101,131,.25)');oval(g,p.x,p.y+7,39,12,'#75b5c7');oval(g,p.x,p.y,36,12,'#d0efeb');const greet=o.done?ease(o.finishT/2.4):0;comet(g,lerp(p.x,o.x+244,greet),lerp(p.y-25,534,greet)+Math.sin(tm*1.1)*greet*3,.63,1,tm);
    crystal(g,o.x+242,670,85,65,'#ade5e0');const meet=o.done?ease(o.finishT/2):0;comet(g,o.x+226-meet*6,560+Math.sin(tm)*5,.74,.7+meet*.3,tm,1);comet(g,o.x+273+meet*3,575+Math.sin(tm+1)*5,.53,.8+meet*.2,tm+1,2);
    if(o.done){g.globalAlpha=ease(o.finishT/1.5);for(let j=0;j<5;j++)star(g,o.x+210+(j-2)*32,494-Math.sin(j*.7+tm)*10,9,COLORS[j%4],tm*.1);g.restore();return;}g.restore();
  }
  function drawToy(o,tm){
    if(!visible(o.x,430))return;warm();
    if(o.world===0&&o.kind===0)moonRoverDraw(o,tm);else if(o.world===0&&o.kind===1)craterDraw(o,tm);else if(o.world===0&&o.kind===2)photoDraw(o,tm);
    else if(o.world===1&&o.kind===0)solarDraw(o,tm);else if(o.world===1&&o.kind===1)marsRoverDraw(o,tm);else if(o.world===1&&o.kind===2)dunesDraw(o,tm);
    else if(o.world===2&&o.kind===0)bandsDraw(o,tm);else if(o.world===2&&o.kind===1)sailDraw(o,tm);else if(o.world===2&&o.kind===2)stormDraw(o,tm);
    else if(o.world===3&&o.kind===0)auroraDraw(o,tm);else if(o.world===3&&o.kind===1)chimesDraw(o,tm);else glideDraw(o,tm);
    if(o.started&&!o.done&&o.nearT>2){g.save();g.globalAlpha=.5;star(g,o.x,346+Math.sin(tm*1.9)*9,10,COLORS[o.world],tm*.1);g.restore();}
  }
  function finalStart(o){
    if(o.done||o.phase||P.ucus||DURUM!=='oyun')return;o.phase='hello';o.t=0;o.fx=P.x;o.sx=P.x;const mother=window.AILE14&&typeof AILE14.state==='function'?AILE14.state():null;o.mx=mother&&mother.hazir&&Number.isFinite(mother.x)?mother.x:P.x-90;o.fy=720;o.sent=false;activeFinal=o;P.ucus=o;P.vx=P.vy=0;P.ground=true;P.buf=0;P.kilit=0;V14.final=true;hand.on=false;ev('k14FinalStart',{o,reunited:!!V14.reunited,seals:V14.seals.slice()});
  }
  function finalStep(o,dt,U){
    dt=validDt(dt);if(!dt||P.ucus!==o||DURUM!=='oyun')return;o.t+=dt;const old=o.fx;o.fx=lerp(o.sx,o.x+12,ease(o.t/3.5));P.x=o.fx;P.y=720;P.vx=(o.fx-old)/dt;P.vy=0;P.ground=true;P.f=o.t>18?-1:1;
    D.x=lerp(D.x,o.x+120,1-Math.exp(-dt*2));D.y=lerp(D.y,552+Math.sin(time*1.8)*9,1-Math.exp(-dt*2));
    o.phase=o.t<5?'hello':o.t<16?'compass':o.t<24?'hug':'goodnight';
    if(o.t>=28&&!o.sent){o.sent=true;o.done=true;o.phase='done';P.ucus=null;P.x=P.safeX=o.x+12;P.y=P.safeY=720;P.vx=P.vy=0;P.ground=true;activeFinal=null;viewState.insideShip=false;if(window.AILE14&&typeof AILE14.anchor==='function')AILE14.anchor(o.x-24,720,1);ev('k14FinalDone',{o,reunited:!!V14.reunited,seals:V14.seals.slice(),activities:V14.activity||0});}
  }
  function finalDraw(o,tm){
    if(!visible(o.x,500))return;warm();g.save();base(g,o.x,720,430,'#a2c3bd');
    if(activeFinal!==o){compass(g,o.x,586,.88,.9);return g.restore();}
    const t=o.t,entry=ease(t/3.5),hug=ease((t-16)/3),bye=ease((t-24)/2),ax=lerp(lerp(o.mx,o.x-110,entry),o.x-24,hug),fx=lerp(lerp(o.sx,o.x+39,entry),o.x+12,hug),poseName=t<4?'yuru':t<16?'el_salla':t<24?'saril':'el_salla',gesture=t<4?1:t<16?ease((t-4)/2)*(1-ease((t-14)/2)):t<24?hug*(1-ease((t-22)/2)):bye;
    crew(g,ax,720,1.03,'anne',poseName,tm,{yon:1,smile:1,reach:hug,poseU:gesture,gazeX:.55,gazeY:.25,hiz:t<4?45:0,walk:t<4?1-entry:0,phase:crewPhase('anne',Math.abs(lerp(o.mx,o.x-110,entry)-o.mx),45)});crew(g,fx,720,.98,'feza',poseName,tm,{yon:t<16?1:-1,smile:1,reach:hug,poseU:gesture,gazeX:.45,gazeY:-.35,hiz:t<4?45:0,walk:t<4?1-entry:0,phase:crewPhase('feza',Math.abs(lerp(o.sx,o.x+39,entry)-o.sx),45)});
    if(t>3&&t<22){g.save();g.globalAlpha=ease((t-3)/2)*(1-ease((t-17)/5));compass(g,o.x+116,559,.85,1);for(let w=0;w<4;w++){const a=-Math.PI/2+w*Math.PI/2,u=V14.seals[w]?1:.25;g.globalAlpha*=u;star(g,o.x+116+Math.cos(a)*75,559+Math.sin(a)*75,12,COLORS[w],tm*.1);g.globalAlpha/=u;}g.restore();}
    const count=V14.reunited?3:1;for(let j=0;j<count;j++){const a=tm*.28+j*TAU/count,x=o.x+Math.cos(a)*(170+j*17),y=435+Math.sin(a)*55-t*.5;g.save();g.globalAlpha=ease((t-5-j)/2)*(1-bye*.8);comet(g,x,y,j?.45:.7,.9,tm+j,j?j%2+1:0);g.restore();}
    if(t>17){g.save();g.globalAlpha=ease((t-17)/2)*.4;for(let j=0;j<12;j++){const a=j*2.399,r=95+((t*13+j*17)%120);star(g,o.x+Math.cos(a)*r,590+Math.sin(a)*r*.6,3+(j%3),COLORS[j%4],tm*.08);}g.restore();}g.restore();
  }
  function pointFrom(e){const r=cv.getBoundingClientRect();point.x=cam.x+(e.clientX-r.left)*DPR/S;point.y=cam.y+(e.clientY-r.top)*DPR/S;return point;}
  function findToy(x,y){let best=null,score=Infinity;for(const o of toys){if(!near(o,600)||Math.abs(x-o.x)>360||y<315||y>740)continue;const d=Math.abs(x-o.x)+Math.abs(y-570)*.25;if(d<score){score=d;best=o;}}return best;}
  function cancel(){if(hand.on&&hand.o&&hand.part>=0){const p=hand.o.parts[hand.part];if(p&&!p.done){p.x=p.hx;p.y=p.hy;}}hand.on=false;hand.id=null;hand.o=null;hand.part=-1;hand.kind='';for(const o of toys)o.lastAngle=null;}
  function down(e){
    if(DURUM!=='oyun'||e.target!==cv||e.pointerType==='mouse'&&e.button!==0)return;
    if(hand.on&&hand.id!==e.pointerId)return;
    if(P.ucus)return; // Ship steering remains the familiar hold input owned by the motor.
    if(typeof dugmede==='function'&&dugmede(e.clientX,e.clientY)){freshWalkIntent();return;}
    const p=pointFrom(e),o=findToy(p.x,p.y);if(!o){freshWalkIntent();return;}
    hand.on=true;hand.id=e.pointerId;hand.o=o;hand.part=-1;hand.x=hand.px=p.x;hand.y=hand.py=p.y;hand.d=0;hand.kind='toy';actToy(o,p.x,p.y,'tap');
    try{cv.setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();e.stopPropagation();
  }
  function move(e){
    if(!hand.on||hand.id!==e.pointerId||DURUM!=='oyun')return;const p=pointFrom(e),dx=p.x-hand.x,dy=p.y-hand.y,d=Math.hypot(dx,dy);if(d<3)return;hand.px=hand.x;hand.py=hand.y;hand.x=p.x;hand.y=p.y;hand.d+=d;const o=hand.o;
    if(o.parts.length&&hand.part>=0&&!o.parts[hand.part].done){const q=o.parts[hand.part];q.x=clamp(p.x,o.x-300,o.x+300);q.y=clamp(p.y,330,720);o.lastInput=time;o.pop=1;}
    else actToy(o,p.x,p.y,'move',dx,dy);
    e.preventDefault();e.stopPropagation();
  }
  function up(e){
    if(!hand.on||e.pointerId!==hand.id)return;const o=hand.o;
    if(o&&hand.part>=0){const q=o.parts[hand.part];if(q&&!q.done){if(e.type==='pointerup'&&(hand.d<18||Math.hypot(q.x-q.tx,q.y-q.ty)<104))solvePart(o,hand.part);else{q.x=q.hx;q.y=q.hy;}}}
    cancel();
  }
  addEventListener('pointerdown',down,true);addEventListener('pointermove',move,true);addEventListener('pointerup',up,true);addEventListener('pointercancel',up,true);addEventListener('lostpointercapture',up,true);addEventListener('blur',cancel);addEventListener('pagehide',cancel);
  if(typeof document.addEventListener==='function')document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
  addEventListener('keydown',e=>{if(!e.repeat&&/^(ArrowLeft|ArrowRight|KeyA|KeyD|Space|ArrowUp)$/.test(e.code))freshWalkIntent();},true);
  addEventListener('keydown',e=>{
    if(DURUM!=='oyun'||P.ucus||e.repeat||e.target&&/^(INPUT|BUTTON|SELECT|TEXTAREA|A)$/.test(e.target.tagName)||!/^(KeyE|Enter|Digit[1-5])$/.test(e.code))return;
    let o=null,d=Infinity;for(const q of toys){const n=Math.abs(P.x-q.x);if(n<450&&n<d){d=n;o=q;}}if(!o)return;let x=o.x,y=590;
    const k=/^Digit/.test(e.code)?Number(e.code.slice(-1))-1:-1;
    if(o.parts.length){const j=k>=0?Math.min(k,o.parts.length-1):o.parts.findIndex(q=>!q.done);if(j>=0){x=o.parts[j].x;y=o.parts[j].y;}}
    else if(o.world===0&&o.kind===1){const j=k>=0?Math.min(k,3):o.notes.slice(0,4).findIndex(q=>!q.hit);x=o.x-174+Math.max(0,j)*116;y=685;}
    else if(o.marks.length){const j=k>=0?Math.min(k,o.marks.length-1):o.marks.findIndex(q=>!q.hit);if(j>=0){x=o.marks[j].x;y=o.marks[j].y;}else if(o.world===3&&o.kind===2){x=o.x+235;y=610;}}
    else if(o.world===1&&o.kind===0){const j=k>=0?k:o.dust.findIndex(v=>v>.02);x=o.x-180+Math.max(0,j)*90;y=575;}
    else if(o.world===1&&o.kind===1){x=o.rock.x;y=660;}
    else if(o.world===1&&o.kind===2){const j=k>=0?Math.min(k,2):o.dunes.findIndex(v=>v<.98);x=o.x-170+Math.max(0,j)*170;y=j<0?510:650;}
    else if(o.world===2&&o.kind===2){const a=o.swirl+.5;x=o.x+Math.cos(a)*125;y=505+Math.sin(a)*125;}
    else if(o.world===3&&o.kind===1){const j=k>=0?k:o.notes.findIndex(q=>!q.hit);x=o.x-200+Math.max(0,j)*100;y=530;}
    actToy(o,x,y,'key');e.preventDefault();e.stopPropagation();
  },true);
  function runtime(dt){
    dt=validDt(dt);if(!dt||DURUM!=='oyun')return;time+=dt;warm();
    for(const p of sparks)if(p.on){p.t+=dt;if(p.t>=p.life){p.on=false;continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=20*dt;p.vx*=Math.exp(-dt*.6);}
    for(const p of rings)if(p.on){p.t+=dt;if(p.t>=p.life)p.on=false;}
    if(!buddy.initialized){buddy.initialized=true;buddy.x=P.x+120;buddy.y=P.y-170;}
    let tx=P.x+140,ty=P.y-170+Math.sin(time*.8)*12;if(encounter.o&&!encounter.o.done&&(!encounter.o.engaged||time-encounter.o.lastInput>9||nextStageCue(encounter.o))&&near(encounter.o,800)&&encounter.phase!=='skip'){const o=encounter.o,q=firstAction(o),age=time-encounter.start,stage=nextStageCue(o);tx=q.x;ty=q.y-55;if(o.world===1&&o.kind===0){let j=o.dust.findIndex(d=>d>.01);if(j<0)j=0;const sweep=.5+.5*Math.sin(age*1.7);tx=lerp(o.x-263,o.x-180+j*90,sweep);ty=lerp(515,565-Math.sin(j*Math.PI/4)*53,sweep);}else if(o.world===1&&o.kind===2){tx+=Math.sin(age*1.8)*55;ty=q.y-45-Math.sin(age*1.8)*12;}else if(o.world===2&&o.kind===2){tx=o.x+Math.cos(age*1.2)*122;ty=505+Math.sin(age*1.2)*88;}if(!stage&&age<1.15){tx=P.x+85;ty=P.y-164+Math.sin(age*3)*5;}else if(!stage&&age%5>3.8){tx=lerp(q.x,P.x+75,.42);ty=q.y-80+Math.sin(age*2)*6;}buddy.joy=Math.max(buddy.joy,.55);}const photo=toys.find(o=>o.world===0&&o.kind===2&&near(o,600));if(photo&&photo.photo){tx=photo.x+292;ty=484+Math.sin(time*.8)*7;}
    if(V14.reunited&&!activeFlight&&!activeFinal){const last=toys.find(o=>o.world===3&&o.kind===2);if(last){tx=last.x+245;ty=560;}}
    if(activeFlight){tx=activeFlight.fx+200;ty=activeFlight.fy-125;}
    if(activeFinal){tx=activeFinal.x+140;ty=470;}
    buddy.vx+=((tx-buddy.x)*12-buddy.vx*6)*dt;buddy.vy+=((ty-buddy.y)*12-buddy.vy*6)*dt;buddy.x+=buddy.vx*dt;buddy.y+=buddy.vy*dt;buddy.look=lerp(buddy.look,clamp((P.x-buddy.x)/180,-1,1),1-Math.exp(-dt*4));buddy.joy=Math.max(0,buddy.joy-dt*.4);
    if(activeFlight&&P.ucus!==activeFlight)releaseFlight(activeFlight,true);
    if(activeFinal&&P.ucus!==activeFinal){activeFinal.phase='';activeFinal=null;viewState.insideShip=false;V14.final=false;}
    encounterStep();syncState();
  }
  function syncState(){
    viewState.encounter=encounter.o?encounter:null;viewState.insideShip=!!(activeFlight||activeFinal);viewState.flight=activeFlight;viewState.final=!!activeFinal;
    viewState.shipX=activeFlight?activeFlight.fx:P.x;viewState.shipY=activeFlight?activeFlight.fy:720;viewState.crewPose=activeFlight?'otur':activeFinal?'saril':'ayakta';viewState.crewX=P.x;viewState.crewY=P.y;
    if(viewState.activity&&!near(viewState.activity,600))viewState.activity=null;
  }
  function poolDraw(tm){
    g.save();for(const p of rings){if(!p.on||!visible(p.x,160))continue;const u=p.t/p.life,r=p.r+u*35;g.globalAlpha=Math.sin(u*Math.PI)*.36;g.strokeStyle=COLORS[p.col%4];g.lineWidth=1.7-u*.8;for(let j=0;j<3;j++){const a=j*TAU/3+.12;g.beginPath();g.ellipse(p.x,p.y,r,r*.68,0,a,a+.78);g.stroke();oval(g,p.x+Math.cos(a+.9)*r,p.y+Math.sin(a+.9)*r*.68,1.8,1.8,COLORS[p.col%4]);}}
    for(const p of sparks){if(!p.on||!visible(p.x,30))continue;g.globalAlpha=(1-p.t/p.life)*.85;star(g,p.x,p.y,p.r,COLORS[p.col%4],p.t*.4);}g.globalAlpha=1;
    const embodied=toys.some(o=>((o.world===2&&o.kind===1)||(o.world===3&&o.kind===2))&&near(o,650));
    if(!activeFinal&&!embodied&&visible(buddy.x,140)&&!(V14.reunited&&(!activeFlight||activeFlight.to===0)))comet(g,buddy.x,buddy.y,.65,buddy.joy,tm,0,buddy.look);g.restore();
  }
  TUR.kaydet('k14Launch',{
    kur(o){o.ready=false;launches.push(o);},guncelle(o,dt){if(!Number.isFinite(dt)||!(dt>0)||DURUM!=='oyun')return;if(!o.ready&&near(o,225)){o.ready=true;sparkle(o.x,570,16,0);ev('k14Launch',{o});}},ciz(o,tm){warm();launchDraw(o,tm);}
  });
  TUR.kaydet('k14Voyage',{
    kur(o){o.x0=Number.isFinite(o.x0)?o.x0:o.x;o.x1=Number.isFinite(o.x1)?o.x1:o.x+90*T;o.inisX=Number.isFinite(o.inisX)?o.inisX:o.x1+45;o.phase='wait';o.done=false;o.fx=o.x0;o.fy=720;o.age=0;o.wakeHead=0;o.wakeT=0;o.wake=Array.from({length:36},()=>({x:0,y:0,age:-1}));o.stars=Array.from({length:6},(_,j)=>({x:lerp(o.x0+350,o.inisX-300,(j+.5)/6),y:425+[50,-35,85,-20,60,-45][j],k:j%4,done:false,pop:0}));o.adim=(dt,U)=>flightStep(o,dt,U);voyages.push(o);},
    guncelle(o,dt){if(!Number.isFinite(dt)||!(dt>0)||DURUM!=='oyun'||o.done)return;if(!P.ucus&&P.ground&&P.x>o.x0-100&&P.x<o.x0+210)startFlight(o);},
    ciz(o,tm){shipDraw(o,tm,false);flightStars(o,tm);},cizOn(o,tm){shipDraw(o,tm,true);}
  });
  TUR.kaydet('k14Activity',{kur:initToy,guncelle:stepToy,ciz:drawToy});
  TUR.kaydet('k14Final',{
    kur(o){o.done=false;o.phase='';o.t=0;o.adim=(dt,U)=>finalStep(o,dt,U);finals.push(o);},guncelle(o,dt){if(!Number.isFinite(dt)||!(dt>0)||DURUM!=='oyun')return;if(!o.done&&!o.phase&&!P.ucus&&P.ground&&near(o,150))finalStart(o);},ciz(o,tm){finalDraw(o,tm);}
  });
  TUR.kaydet('k14Runtime',{kur(o){o.x=P.x;},guncelle(o,dt){o.x=P.x;runtime(dt);},cizOn(o,tm){poolDraw(tm);}});
  OLAY.on('durum',d=>{if(d!=='oyun'){cancel();if(d!=='mola'&&d!=='duraklat'){if(activeFlight)releaseFlight(activeFlight,true);if(activeFinal){if(P.ucus===activeFinal)P.ucus=null;activeFinal.phase='';activeFinal=null;viewState.insideShip=false;V14.final=false;}}}});
  window.UZAY14={
    // Runtime is owned by k14Runtime; this compatibility hook deliberately does not tick it twice.
    adim(){},ciz(){},walkControl,encounter(){return encounter.o?encounter:null;},attentionBounds(){if(!encounter.o||encounter.phase==='skip'||!near(encounter.o,900))return null;const o=encounter.o;attentionBox.x0=Math.min(P.x-120,o.x-440);attentionBox.x1=Math.max(P.x+130,o.x+390);attentionBox.y0=Math.min(310,encounter.targetY-120);attentionBox.y1=780;return attentionBox;},
    hedef(){if(P.ucus)return null;let best=null;for(const list of [toys,voyages,finals])for(const o of list){if(o.done||o.x<P.x-150)continue;if(!best||o.x<best.x)best=o;}return best;},
    kameraKutu(){
      if(activeFlight){cameraBox.x0=activeFlight.fx-275;cameraBox.x1=activeFlight.fx+340;cameraBox.y0=Math.min(210,activeFlight.fy-200);cameraBox.y1=Math.max(760,activeFlight.fy+90);return cameraBox;}
      if(activeFinal){const u=ease((activeFinal.t-15)/5),half=lerp(330,220,u);cameraBox.x0=activeFinal.x-half;cameraBox.x1=activeFinal.x+half;cameraBox.y0=lerp(310,440,u);cameraBox.y1=770;return cameraBox;}return null;
    },
    state(){syncState();return viewState;},
    inspect(){return{time,encounter:encounter.o?{world:encounter.o.world,kind:encounter.o.kind,phase:encounter.phase,age:encounter.age,hold:encounter.hold,stopX:encounter.stopX,targetX:encounter.targetX,targetY:encounter.targetY}:null,insideShip:!!(activeFlight||activeFinal),flight:activeFlight?{from:activeFlight.from,to:activeFlight.to,phase:activeFlight.phase,u:activeFlight.u,x:activeFlight.fx,y:activeFlight.fy}:null,activities:toys.map(o=>({x:o.x,y:o.y,world:o.world,kind:o.kind,u:o.u,done:o.done,engaged:o.engaged,encountered:o.encountered,manual:o.manual,assisted:o.assisted,replayed:o.replay,parts:o.parts.map(q=>({k:q.k,done:q.done,x:q.x,y:q.y,tx:q.tx,ty:q.ty,t:q.t})),rover:o.rover?{x:o.rover.x,target:o.rover.target,u:o.rover.u,drive:o.rover.drive,ready:o.rover.ready,readyT:o.rover.readyT}:null,sail:o.sail?{x:o.sail.x,y:o.sail.y,u:o.sail.u,targetY:o.sail.targetY,run:o.sail.run,next:o.sail.next,waiting:o.sail.waiting,currentRing:o.marks[o.sail.next]?{x:o.marks[o.sail.next].x,y:o.marks[o.sail.next].y}:null,hits:o.marks.map(q=>q.hit)}:null})),hand:{on:hand.on,id:hand.id,world:hand.o?hand.o.world:null,kind:hand.o?hand.o.kind:null,part:hand.part,x:hand.x,y:hand.y,d:hand.d},seals:V14.seals.slice(),reunited:!!V14.reunited,voyages:V14.voyage||0,stats:Object.assign({},stats),finite:Number.isFinite(P.x)&&Number.isFinite(P.y)&&Number.isFinite(P.vx)&&Number.isFinite(P.vy),pool:{sparks:sparks.filter(p=>p.on).length,rings:rings.filter(p=>p.on).length}};}
  };
})();
