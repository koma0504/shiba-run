import {TAU,VIEW_W,VIEW_H,TILE,ROWS,HP_MAX} from './config.js';
import {ctx} from './canvas.js';
import {stage,isSolid} from './stage.js';
import {S} from './state.js';
import {input} from './input.js';
import {makeCanvas,roundRectOn,roundRect,triangleOn,triangle} from './draw.js';
import {DRAW_ORDER,GIMMICKS} from './entities/index.js';
import enemyBullet from './entities/enemyBullet.js';

let i;
// 背景や小物は毎フレーム描き直さず、起動時に一度だけ別canvasへ描いて使い回す
let bgCv,fujiCv,hillCvs;
// 空・山・丘はテーマで色が変わるので、面を読み込むたびに描き直す
export function buildTheme(){const t=stage.theme;
bgCv=makeCanvas(VIEW_W,VIEW_H);{const c=bgCv.getContext('2d');const sk=c.createLinearGradient(0,0,0,VIEW_H);sk.addColorStop(0,t.skyTop);sk.addColorStop(1,t.skyBottom);c.fillStyle=sk;c.fillRect(0,0,VIEW_W,VIEW_H);c.fillStyle=t.sun;c.beginPath();c.arc(566,66,32,0,TAU);c.fill();}
fujiCv=makeCanvas(344,254);{const c=fujiCv.getContext('2d');c.fillStyle=t.mountain;triangleOn(c,2,252,172,2,342,252);c.fillStyle=t.mountainCap;triangleOn(c,120,79,172,2,224,79);}
hillCvs=t.hills.map(function(col){const c2=makeCanvas(400,200),c=c2.getContext('2d');c.fillStyle=col;c.beginPath();c.arc(200,200,200,Math.PI,0);c.fill();return c2;});}
const cloudCv=makeCanvas(100,60);(function(){const c=cloudCv.getContext('2d');c.fillStyle='rgba(255,255,255,0.92)';c.beginPath();c.arc(24,36,20,0,TAU);c.arc(48,28,24,0,TAU);c.arc(76,36,19,0,TAU);c.fill();})();
const boneCv=makeCanvas(30,22);(function(){const c=boneCv.getContext('2d');c.translate(15,11);c.fillStyle='#fffdf4';roundRectOn(c,-9,-3.2,18,6.4,3);c.fill();[[-9,-4],[-9,4],[9,-4],[9,4]].forEach(function(q){c.beginPath();c.arc(q[0],q[1],4.4,0,TAU);c.fill();});})();
const heartCvs=['#e2554a','#cfc8bb'].map(function(col){const c2=makeCanvas(18,16),c=c2.getContext('2d');c.translate(9,4);c.fillStyle=col;c.beginPath();c.arc(-3.4,-2,4,0,TAU);c.arc(3.4,-2,4,0,TAU);c.fill();triangleOn(c,-7.2,-0.5,7.2,-0.5,0,8);return c2;})
const meatCv=makeCanvas(40,26);(function(){const c=meatCv.getContext('2d');c.translate(20,13);c.fillStyle='#fffdf4';roundRectOn(c,-16,-3,10,6,3);c.fill();roundRectOn(c,6,-3,10,6,3);c.fill();c.beginPath();c.arc(-15,-5,3.4,0,TAU);c.arc(-15,5,3.4,0,TAU);c.fill();c.beginPath();c.arc(15,-5,3.4,0,TAU);c.arc(15,5,3.4,0,TAU);c.fill();c.fillStyle='#a85c28';c.beginPath();c.ellipse(0,0,11,9.5,0,0,TAU);c.fill();c.fillStyle='#c97c42';c.beginPath();c.ellipse(-1,-2.5,8,5.5,0,0,TAU);c.fill();})();
const shotCv=makeCanvas(12,12);(function(){const c=shotCv.getContext('2d');c.fillStyle='#5aa9e6';c.beginPath();c.arc(6,6,4.5,0,TAU);c.fill();c.fillStyle='#eaf6ff';c.beginPath();c.arc(6,6,2.2,0,TAU);c.fill();})();
const bigCv=makeCanvas(22,22);(function(){const c=bigCv.getContext('2d');c.fillStyle='#ffd23e';c.beginPath();c.arc(11,11,9,0,TAU);c.fill();c.fillStyle='#fff6d8';c.beginPath();c.arc(11,11,4.5,0,TAU);c.fill();})();
function drawShiba(camI){if(S.player.invincible>0&&((S.time>>2)&1)===0)return;
const cx=S.player.x+15-camI,cy=S.player.y+S.player.h;
ctx.save();ctx.translate(cx,cy);ctx.scale(S.player.facing,1);
if(S.player.squashTimer>0)ctx.scale(1.12,0.86);else if(S.player.stretchTimer>0)ctx.scale(0.92,1.1);
if(S.powerTimer>0&&(S.powerTimer>120||((S.time>>2)&1)===0)){ctx.globalAlpha=0.35+0.15*Math.sin(S.time*0.3);ctx.strokeStyle='#ffd23e';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-22,27,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(0,-22,33,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
if(input.shoot&&S.chargeTimer>=45){ctx.globalAlpha=0.4+0.2*Math.sin(S.time*0.5);ctx.strokeStyle='#5aa9e6';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,-22,24,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
const air=!S.player.onGround,run=Math.min(1,Math.abs(S.player.vx)/4);
const sw=air?3:Math.sin(S.player.walkPhase)*6*Math.max(run,0.15);
const C1='#e39a3b',C2='#f8ebd4',C3='#3b2a1d',C4='#cf8830';
ctx.fillStyle=C1;ctx.beginPath();ctx.arc(-16,-25,7,0,TAU);ctx.fill();
ctx.fillStyle=C2;ctx.beginPath();ctx.arc(-14,-27,3,0,TAU);ctx.fill();
ctx.fillStyle=C4;roundRect(-12+sw*0.5,-10,6,air?8:10,3);ctx.fill();roundRect(6-sw*0.5,-10,6,air?8:10,3);ctx.fill();
ctx.fillStyle=C1;roundRect(-17,-27,32,20,9);ctx.fill();
ctx.fillStyle=C2;ctx.beginPath();ctx.ellipse(-2,-10,11,5.5,0,0,TAU);ctx.fill();
ctx.fillStyle=C1;roundRect(-8-sw*0.5,-11,6,air?9:11,3);ctx.fill();roundRect(10+sw*0.5,-11,6,air?9:11,3);ctx.fill();
ctx.fillStyle=C1;ctx.beginPath();ctx.arc(12,-30,11,0,TAU);ctx.fill();
ctx.fillStyle=C2;ctx.beginPath();ctx.ellipse(16,-26,7.5,5.5,0,0,TAU);ctx.fill();
ctx.fillStyle=C1;triangle(4,-36,8,-47,13,-37);triangle(13,-38,18,-48,21,-36);
ctx.fillStyle='#f2d3a8';triangle(6.5,-38,8.5,-44,11.5,-38.5);triangle(14.5,-39,17.5,-45,19,-38);
ctx.fillStyle=C3;ctx.beginPath();ctx.arc(11,-31,1.9,0,TAU);ctx.fill();
ctx.beginPath();ctx.arc(21.5,-28,2.4,0,TAU);ctx.fill();
ctx.strokeStyle=C3;ctx.lineWidth=1.1;ctx.beginPath();ctx.arc(18,-25.5,2.4,0.3,2.6);ctx.stroke();
ctx.fillStyle='#e2554a';roundRect(3,-21.5,13,3.5,2);ctx.fill();
ctx.restore();}
function drawBoss(camI){const bs=S.boss;
if(bs.mode==='wait'||S.bossDead)return;
if(bs.invincible>0&&((S.time>>1)&1)===0)return;
const x=bs.x-camI+bs.w/2,y=bs.y+bs.h;
ctx.save();ctx.translate(x,y);ctx.scale(bs.facing>0?2.1:-2.1,2.1);
const D='#2e323b',G='#596070',G2='#454b59',WH='#eef1f5';
ctx.strokeStyle=G;ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-15,-14);ctx.quadraticCurveTo(-24,-23,-19,-29);ctx.stroke();
ctx.fillStyle=G2;roundRect(-12,-8,5,8,2);ctx.fill();roundRect(5,-8,5,8,2);ctx.fill();
ctx.fillStyle=G;roundRect(-16,-24,32,18,8);ctx.fill();
ctx.fillStyle='#c9412f';roundRect(-16,-24,32,5,2);ctx.fill();
ctx.fillStyle=G;ctx.beginPath();ctx.arc(11,-24,9,0,TAU);ctx.fill();
triangle(4,-30,7,-39,11,-30);triangle(12,-30,16,-39,18,-29);
ctx.fillStyle='#8a93a5';ctx.beginPath();ctx.arc(11,-27,7,Math.PI,0);ctx.closePath();ctx.fill();
ctx.fillStyle=WH;ctx.beginPath();ctx.ellipse(14,-21,5.5,4,0,0,TAU);ctx.fill();
ctx.fillStyle=D;ctx.beginPath();ctx.arc(9,-24,1.7,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(15,-24.5,1.7,0,TAU);ctx.fill();
ctx.strokeStyle=D;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(5.5,-28);ctx.lineTo(10.5,-26);ctx.stroke();
ctx.fillStyle='#d98a8a';ctx.beginPath();ctx.arc(17.5,-22,1.6,0,TAU);ctx.fill();
ctx.restore();}
const CLOUDS=[],HILLS=[];
for(i=0;i<14;i++)CLOUDS.push([60+i*270,55+((i*53)%100)]);
for(i=0;i<18;i++)HILLS.push([80+i*350,130+((i*97)%90)]);
function drawMeterBar(x,y,val,mx2,segH,col){ctx.fillStyle='rgba(20,26,34,0.55)';roundRect(x-2,y-2,14,mx2*segH+4,4);ctx.fill();
ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fillRect(x,y,10,mx2*segH-2);
ctx.fillStyle=col;
for(let k=0;k<val;k++)ctx.fillRect(x,y+(mx2-1-k)*segH,10,segH-2);}
// 同じ行の連続するタイルを1回のfillRectでまとめて塗る
function runRow(camI,c0,c1,rw,cond,y,h,col){ctx.fillStyle=col;let st=-1;
for(let cc=c0;cc<=c1+1;cc++){const ok=cc<=c1&&cond(cc,rw);
if(ok&&st<0)st=cc;
else if(!ok&&st>=0){ctx.fillRect(st*TILE-camI,y,(cc-st)*TILE,h);st=-1;}}}
function isTop(cc,rw){return isSolid(cc,rw)&&!isSolid(cc,rw-1);}
export function render(){let tgt;
if(S.bossStarted&&!S.bossDead)tgt=stage.arenaLeft;else tgt=Math.min(Math.max(S.player.x-VIEW_W*0.4,0),stage.worldW-VIEW_W);
S.cameraX+=(tgt-S.cameraX)*0.15;if(Math.abs(tgt-S.cameraX)<0.5)S.cameraX=tgt;
const camI=Math.round(S.cameraX);let sx,k;
ctx.drawImage(bgCv,0,0);
// 遠景ほどゆっくり流して奥行きを出す
const fxp=Math.round(588-camI*0.15);
ctx.drawImage(fujiCv,fxp,188);
for(k=0;k<CLOUDS.length;k++){sx=CLOUDS[k][0]-camI*0.3;if(sx<-110||sx>VIEW_W+10)continue;ctx.drawImage(cloudCv,sx|0,CLOUDS[k][1]);}
for(k=0;k<HILLS.length;k++){sx=HILLS[k][0]-camI*0.55;const hr=HILLS[k][1];if(sx<-hr-40||sx>VIEW_W+hr+40)continue;ctx.drawImage(hillCvs[k&1],(sx-hr)|0,440-hr,hr*2,hr);}
const c0=Math.max(0,Math.floor(camI/TILE)),c1=Math.min(stage.cols-1,c0+17);let rw;
for(rw=0;rw<ROWS;rw++)runRow(camI,c0,c1,rw,isSolid,rw*TILE,TILE,stage.theme.dirt);
for(rw=0;rw<ROWS;rw++)runRow(camI,c0,c1,rw,isSolid,rw*TILE+TILE-6,6,'rgba(0,0,0,0.08)');
for(rw=0;rw<ROWS;rw++)runRow(camI,c0,c1,rw,isTop,rw*TILE,12,stage.theme.grass);
for(rw=0;rw<ROWS;rw++)runRow(camI,c0,c1,rw,isTop,rw*TILE,5,stage.theme.grassLight);
for(const g of GIMMICKS)g.draw(camI);
for(k=0;k<stage.checkpoints.length;k++){const kx=stage.checkpoints[k]-camI;
if(kx>-40&&kx<VIEW_W+40){ctx.fillStyle='#8a6b4a';ctx.fillRect(kx,376,5,64);ctx.fillStyle=S.checkpointIndex>=k?'#f0a03c':'#cbbfae';ctx.beginPath();ctx.arc(kx+2.5,366,13,0,TAU);ctx.fill();ctx.fillStyle='#5c452c';ctx.beginPath();ctx.arc(kx+2.5,369,4,0,TAU);ctx.arc(kx-3.5,362,2.2,0,TAU);ctx.arc(kx+2.5,360,2.2,0,TAU);ctx.arc(kx+8.5,362,2.2,0,TAU);ctx.fill();}}
const hx=stage.goalX-camI;
if(hx>-180&&hx<VIEW_W+40){
ctx.fillStyle='#9a8f7f';ctx.fillRect(hx-26,296,5,144);
ctx.fillStyle='#ffd23e';triangle(hx-21,298,hx+26,313,hx-21,328);
ctx.fillStyle='#7a5a10';ctx.beginPath();ctx.arc(hx-8,313,3,0,TAU);ctx.arc(hx-13,307,1.7,0,TAU);ctx.arc(hx-8,305,1.7,0,TAU);ctx.arc(hx-3,307,1.7,0,TAU);ctx.fill();
ctx.fillStyle='#cf5a4f';roundRect(hx,336,116,104,6);ctx.fill();
ctx.fillStyle='#8f3a33';triangle(hx-12,344,hx+58,294,hx+128,344);
// ボスを倒すまで扉に閂がかかっている
ctx.fillStyle=S.bossDead?'#57241f':'#7d6a63';ctx.beginPath();ctx.moveTo(hx+38,440);ctx.lineTo(hx+38,396);ctx.arc(hx+58,396,20,Math.PI,0);ctx.lineTo(hx+78,440);ctx.closePath();ctx.fill();
if(!S.bossDead){ctx.strokeStyle='#5a4b45';ctx.lineWidth=3;ctx.beginPath();for(k=0;k<3;k++){ctx.moveTo(hx+42,392+k*15);ctx.lineTo(hx+74,392+k*15);}ctx.stroke();}
ctx.drawImage(boneCv,hx+43,351);}
for(k=0;k<S.bones.length;k++){const b=S.bones[k];if(b.taken)continue;const bx=b.x-camI;if(bx<-30||bx>VIEW_W+30)continue;
ctx.drawImage(boneCv,bx-15,(b.y-11+Math.sin(S.time*0.08+b.x)*3)|0);}
for(k=0;k<S.meats.length;k++){const mt=S.meats[k];if(mt.taken)continue;const mx3=mt.x-camI;if(mx3<-40||mx3>VIEW_W+40)continue;
ctx.drawImage(meatCv,mx3-20,(mt.y-13+Math.sin(S.time*0.08)*3)|0);}
for(const def of DRAW_ORDER)def.draw(camI);
if(S.bossStarted)drawBoss(camI);
drawShiba(camI);
for(k=0;k<S.shots.length;k++){const sh=S.shots[k];const shx=sh.x-camI;
if(sh.isCharged){ctx.globalAlpha=0.5;ctx.drawImage(bigCv,(shx-sh.vx*1.2-11)|0,sh.y-11);ctx.globalAlpha=1;ctx.drawImage(bigCv,(shx-11)|0,sh.y-11);}
else{ctx.globalAlpha=0.45;ctx.drawImage(shotCv,(shx-sh.vx*1.3-6)|0,sh.y-6);ctx.globalAlpha=1;ctx.drawImage(shotCv,(shx-6)|0,sh.y-6);}}
enemyBullet.draw(camI);
for(k=0;k<S.particles.length;k++){const f=S.particles[k];const fx2=f.x-camI;if(fx2<-20||fx2>VIEW_W+20)continue;ctx.globalAlpha=f.life/f.maxLife;ctx.fillStyle=f.color;ctx.fillRect(fx2-f.size/2,f.y-f.size/2,f.size,f.size);}
ctx.globalAlpha=1;
ctx.font='500 13px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
for(k=0;k<S.popups.length;k++){const q=S.popups[k];const qx=q.x-camI;if(qx<-40||qx>VIEW_W+40)continue;
if(!q.width)q.width=ctx.measureText(q.text).width;
ctx.globalAlpha=Math.min(1,q.life/20);ctx.fillStyle='rgba(255,255,255,0.85)';roundRect(qx-q.width/2-6,q.y-10,q.width+12,20,10);ctx.fill();ctx.fillStyle=q.color;ctx.fillText(q.text,qx,q.y);}
ctx.globalAlpha=1;ctx.textAlign='left';
ctx.fillStyle='rgba(255,255,255,0.82)';roundRect(8,8,104,30,15);ctx.fill();
ctx.drawImage(boneCv,17,13,25,18);
ctx.fillStyle='#5a4632';ctx.font='500 16px sans-serif';ctx.fillText('× '+S.boneCount,46,24);
ctx.fillStyle='rgba(255,255,255,0.82)';roundRect(VIEW_W/2-66,8,132,30,15);ctx.fill();
ctx.fillStyle='#5a4632';ctx.textAlign='center';ctx.fillText('スコア '+S.score,VIEW_W/2,24);ctx.textAlign='left';
if(S.powerTimer>0){ctx.fillStyle='rgba(255,255,255,0.82)';roundRect(VIEW_W/2-42,42,84,10,5);ctx.fill();ctx.fillStyle=(S.powerTimer<120&&((S.time>>2)&1)===0)?'#e2554a':'#f0a03c';roundRect(VIEW_W/2-39,44,78*(S.powerTimer/480),6,3);ctx.fill();}
drawMeterBar(10,46,S.hp,HP_MAX,9,S.hp<=2&&((S.time>>3)&1)===0?'#e2554a':'#79c94f');
if(S.bossStarted&&!S.bossDead){const shown=S.boss.mode==='intro'?Math.floor(S.boss.hp*Math.min(1,S.boss.timer/60)):S.boss.hp;
drawMeterBar(30,46,shown,S.boss.hpMax,5,'#f0a03c');}
ctx.fillStyle='rgba(255,255,255,0.82)';roundRect(VIEW_W-142,8,134,30,15);ctx.fill();
for(k=0;k<5;k++)ctx.drawImage(heartCvs[k<S.lives?0:1],VIEW_W-129+k*24,14);}
