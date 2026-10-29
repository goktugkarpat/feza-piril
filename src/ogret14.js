/* Küçük bir ışık, yalnız gerçekten dokunulabilen nesneyi gösterir.
   Yazı, el simgesi veya açılan panel yok. Örnek hareket hiçbir oyunu çözmez. */
'use strict';
const OGRET14=(()=>{
  const TAU=Math.PI*2,PALETTE=['#ffedb0','#aee9e6','#ffe0ac','#ccf5ef'];
  const finite=Number.isFinite;
  function ring(c,x,y,r,a,col){
    c.globalAlpha=a*.34;c.strokeStyle='#173448';c.lineWidth=4;
    c.beginPath();c.ellipse(x,y,r,r*.93,0,0,TAU);c.stroke();
    c.globalAlpha=a;c.strokeStyle=col;c.lineWidth=1.8;
    c.beginPath();c.ellipse(x,y,r,r*.93,0,0,TAU);c.stroke();
  }
  function mote(c,x,y,r,a,col){
    c.globalAlpha=a*.14;c.fillStyle=col;c.beginPath();c.ellipse(x,y,r*2.9,r*2.9,0,0,TAU);c.fill();
    c.globalAlpha=a;c.fillStyle='#fff8df';c.beginPath();c.ellipse(x,y,r,r,0,0,TAU);c.fill();
  }
  function ciz(c,o,tm,d){
    if(!c||!o||!d||d.done||d.settling||!finite(d.x)||!finite(d.y)||!finite(tm))return;
    if(typeof BOLUM_NO!=='undefined'&&BOLUM_NO!==14)return;
    if(typeof P!=='undefined'&&(P.ucus||Math.abs(P.x-o.x)>680||Math.abs(P.y-o.y)>440))return;
    if(typeof DURUM!=='undefined'&&DURUM!=='oyun')return;
    const r=Math.max(27,Math.min(68,finite(d.r)?d.r:42)),idle=Math.max(0,finite(d.idle)?d.idle:0);
    const col=PALETTE[o.world]||PALETTE[0],beat=.5+.5*Math.sin(tm*2.7),radius=r+4+beat*3;
    c.save();c.setLineDash([]);c.lineCap='round';c.lineJoin='round';
    ring(c,d.x,d.y,radius,.43+beat*.19,col);
    // Two tiny warm accents belong to the target, not to a floating HUD button.
    mote(c,d.x-radius*.7,d.y-radius*.77,1.7,.48+beat*.2,col);
    mote(c,d.x+radius*.77,d.y+radius*.6,1.3,.34+beat*.2,col);
    const moving=d.action==='place'||d.action==='guide';
    if(moving&&finite(d.fromX)&&finite(d.fromY)&&finite(d.toX)&&finite(d.toY)){
      const dx=d.toX-d.fromX,dy=d.toY-d.fromY,len=Math.hypot(dx,dy);
      if(len>28){
        const mx=(d.fromX+d.toX)*.5,my=(d.fromY+d.toY)*.5-Math.min(34,len*.12);
        c.globalAlpha=idle>3?.32:.16;c.strokeStyle=col;c.lineWidth=2;c.setLineDash([2,9]);
        c.beginPath();c.moveTo(d.fromX,d.fromY);c.quadraticCurveTo(mx,my,d.toX,d.toY);c.stroke();c.setLineDash([]);
        if(d.action==='place')ring(c,d.toX,d.toY,Math.max(23,r*.78),.28+beat*.16,col);
        if(idle>3.5){
          const u=((idle-3.5)%5)/5;
          if(u<.72){const t=u/.72,v=1-t;mote(c,v*v*d.fromX+2*v*t*mx+t*t*d.toX,v*v*d.fromY+2*v*t*my+t*t*d.toY,3.3,Math.sin(t*Math.PI)*.78,col);}
        }
      }
    }else if(d.action==='rub'&&idle>3.5){
      // A short sweep on the dusty/sandy surface demonstrates rubbing, then rests.
      const u=((idle-3.5)%5)/5;
      if(u<.68){const t=u/.68,x=d.x+Math.sin(t*TAU*1.25)*r*.6,y=d.y+Math.sin(t*TAU*.65)*r*.18;
        c.globalAlpha=.2;c.strokeStyle=col;c.lineWidth=5;c.beginPath();c.moveTo(d.x-r*.6,d.y);c.quadraticCurveTo(d.x,d.y-r*.18,d.x+r*.6,d.y);c.stroke();mote(c,x,y,3.3,Math.sin(t*Math.PI)*.76,col);}
    }else if(idle>4){
      // A light touches this exact object; no hidden progress or fake completion.
      const u=((idle-4)%5)/5;
      if(u<.24){const t=u/.24;mote(c,d.x,d.y-20*(1-t),3.2,Math.sin(t*Math.PI)*.7,col);}
    }
    c.restore();
  }
  return{ciz};
})();
if(typeof window!=='undefined')window.OGRET14=OGRET14;
