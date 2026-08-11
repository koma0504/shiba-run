import {TAU,VIEW_W,VIEW_H,TILE,COLS,ROWS,WORLD_W,HP_MAX} from './config.js';
import {CHECKPOINTS,GOAL_X,ARENA_LEFT,ARENA_RIGHT,isSolid} from './level.js';
import {S,makeBoss,resetPlayer} from './state.js';
import {sfx} from './audio.js';
import {spawnParticles,spawnRing,popText} from './fx.js';
import {input} from './input.js';
import {gameOver,clearGame} from './ui.js';

let i,j;
export function tryFire(big){if(S.state!=='play')return;
if(!big&&(S.shots.length>=3||S.fireCooldown>0))return;
const sx=S.player.facing>0?S.player.x+S.player.w+2:S.player.x-8,sy=S.player.y+9;
S.shots.push({x:sx,y:sy,vx:S.player.facing*(big?8.5:7.5),isCharged:!!big,damage:big?3:1});
S.fireCooldown=9;sfx(big?'big':'shot');}
function rectsOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function resolveTiles(o,ax){const c1=Math.max(0,Math.floor(o.x/TILE)),c2=Math.min(COLS-1,Math.floor((o.x+o.w-0.01)/TILE));const r1=Math.max(0,Math.floor(o.y/TILE)),r2=Math.min(ROWS-1,Math.floor((o.y+o.h-0.01)/TILE));for(let rr=r1;rr<=r2;rr++)for(let cc=c1;cc<=c2;cc++){if(!isSolid(cc,rr))continue;if(ax==='x'){if(o.vx>0)o.x=cc*TILE-o.w;else if(o.vx<0)o.x=(cc+1)*TILE;o.vx=0;}else{if(o.vy>0){o.y=rr*TILE-o.h;o.vy=0;o.onGround=true;}else if(o.vy<0){o.y=(rr+1)*TILE;o.vy=0;}}}}
function loseLife(){S.lives--;S.combo=0;S.powerTimer=0;sfx('hit');spawnParticles(S.player.x+15,S.player.y+15,12,'#e2554a',2.8,0.1,32,3);S.shots.length=0;S.enemyBullets.length=0;
if(S.bossStarted&&!S.bossDead){S.boss=makeBoss();S.bossStarted=false;}
if(S.lives<=0){resetPlayer(false);gameOver();}else resetPlayer(false);}
function hurtPlayer(d,fromX){if(S.player.invincible>0||S.powerTimer>0)return;
S.hp-=d;S.player.invincible=60;S.player.stunTimer=12;S.combo=0;
S.player.vx=(S.player.x+S.player.w/2<fromX?-1:1)*3.5;S.player.vy=-4;
sfx('hit');spawnParticles(S.player.x+15,S.player.y+15,7,'#e2554a',2.2,0.1,24,2.6);
if(S.hp<=0)loseLife();}
function killEnemy(e2,pts){e2.deadTimer=e2.deadTimer||1;S.score+=pts;popText(e2.x+e2.w/2,e2.y-6,'+'+pts,'#a86b1e');spawnParticles(e2.x+e2.w/2,e2.y+10,8,'#ffd23e',2.2,0.08,26,2.6);sfx('stomp');}
function stompEnemy(e2,isCrow){e2.deadTimer=1;S.combo++;const pts=100*S.combo;S.score+=pts;
popText(e2.x+10,e2.y-6,S.combo>1?('コンボ×'+S.combo+'  +'+pts):('+'+pts),S.combo>1?'#c25a1e':'#5a4632');
spawnParticles(e2.x+15,e2.y+8,8,'#ffffff',2.2,0.06,24,2.4);S.player.vy=isCrow?-9.5:-8.5;S.player.usedDoubleJump=false;sfx('stomp');}
function damageBoss(d){if(S.boss.invincible>0||S.boss.mode==='wait'||S.boss.mode==='intro'||S.boss.mode==='die')return;
S.boss.hp-=d;S.boss.invincible=12;sfx('bhit');spawnParticles(S.boss.x+35,S.boss.y+24,5,'#ffffff',2,0.05,16,2.4);
if(S.boss.hp<=0){S.boss.hp=0;S.boss.mode='die';S.boss.deathTimer=0;S.boss.vx=0;}}
export function step(){S.time++;S.playFrames++;
let m,u,pos;
for(i=0;i<S.movers.length;i++){m=S.movers[i];u=0.5+0.5*Math.sin(S.time*TAU/m.period+m.phase);pos=m.from+(m.to-m.from)*u;
if(m.axis==='x'){m.dx=pos-m.x;m.x=pos;m.dy=0;}else{m.dy=pos-m.y;m.y=pos;m.dx=0;}}
if(input.shoot){S.chargeTimer++;if(S.chargeTimer===45)sfx('chg');
if(S.chargeTimer>12&&(S.time&3)===0)spawnParticles(S.player.x+15+(Math.random()-0.5)*30,S.player.y+15+(Math.random()-0.5)*30,1,S.chargeTimer>=45?'#ffd23e':'#9fd4ff',0.6,-0.03,14,2);}
if(S.fireCooldown>0)S.fireCooldown--;
const ACC=0.65,MX=S.powerTimer>0?5.4:4.3;
if(S.player.stunTimer>0){S.player.stunTimer--;}
else if(input.left&&!input.right){S.player.vx=Math.max(S.player.vx-ACC,-MX);S.player.facing=-1;}
else if(input.right&&!input.left){S.player.vx=Math.min(S.player.vx+ACC,MX);S.player.facing=1;}
else{S.player.vx*=0.72;if(S.player.vx>-0.1&&S.player.vx<0.1)S.player.vx=0;}
S.player.coyote=S.player.onGround?7:S.player.coyote-1;
if(input.jumpPressed){S.player.jumpBuffer=8;input.jumpPressed=false;}else S.player.jumpBuffer--;
if(S.player.stunTimer<=0&&S.player.jumpBuffer>0){
if(S.player.coyote>0){S.player.vy=-13.6;S.player.coyote=0;S.player.jumpBuffer=0;S.player.usedDoubleJump=false;S.player.stretchTimer=6;sfx('jump');}
else if(!S.player.usedDoubleJump){S.player.usedDoubleJump=true;S.player.vy=-11.8;S.player.jumpBuffer=0;S.player.stretchTimer=6;spawnParticles(S.player.x+15,S.player.y+30,6,'#dfeaf2',1.8,0.04,20,2.4);sfx('dj');}}
if(!input.jump&&S.player.vy<-4.5)S.player.vy=-4.5;
S.player.vy=Math.min(S.player.vy+0.55,15);
S.player.x+=S.player.vx;
const lx=S.bossStarted&&!S.bossDead?ARENA_LEFT+4:0,rx=S.bossStarted&&!S.bossDead?ARENA_RIGHT-S.player.w-4:WORLD_W-S.player.w;
if(S.player.x<lx){S.player.x=lx;S.player.vx=0;}if(S.player.x>rx){S.player.x=rx;S.player.vx=0;}
resolveTiles(S.player,'x');
const wasOn=S.player.onGround,fallV=S.player.vy;
S.player.onGround=false;S.player.y+=S.player.vy;
let s;
for(i=0;i<S.springs.length;i++){s=S.springs[i];if(s.squash>0)s.squash--;
if(S.player.vy>=0&&S.player.x+S.player.w>s.x+3&&S.player.x<s.x+s.w-3){const ft2=S.player.y+S.player.h;
if(ft2>=s.y-2&&ft2<=s.y+s.h+2){S.player.y=s.y-S.player.h;S.player.vy=-20;S.player.usedDoubleJump=false;s.squash=8;S.player.stretchTimer=8;spawnParticles(s.x+14,s.y,7,'#ffffff',2,0.05,22,2.2);sfx('spring');}}}
resolveTiles(S.player,'y');
for(i=0;i<S.movers.length;i++){m=S.movers[i];
if(S.player.vy>=0&&S.player.x+S.player.w>m.x&&S.player.x<m.x+m.w){const ft=S.player.y+S.player.h;
if(ft>=m.y-8&&ft<=m.y+m.h+6){S.player.y=m.y-S.player.h;S.player.vy=0;S.player.onGround=true;S.player.x+=m.dx;}}}
if(S.player.onGround){S.player.usedDoubleJump=false;S.combo=0;
if(!wasOn&&fallV>7){S.player.squashTimer=6;spawnParticles(S.player.x+15,S.player.y+30,5,'#c9b08a',1.6,0.06,18,2.4);}}
S.player.walkPhase+=(S.player.vx<0?-S.player.vx:S.player.vx)*0.35;
if(S.player.invincible>0)S.player.invincible--;
if(S.powerHitCooldown>0)S.powerHitCooldown--;
if(S.powerTimer>0){S.powerTimer--;if((S.time%3)===0)spawnParticles(S.player.x+15+(Math.random()-0.5)*24,S.player.y+15+(Math.random()-0.5)*24,1,'#ffd23e',0.8,-0.02,20,2);}
if(S.player.squashTimer>0)S.player.squashTimer--;if(S.player.stretchTimer>0)S.player.stretchTimer--;
let b;const pcx=S.player.x+15,pcy=S.player.y+15;
for(i=0;i<S.bones.length;i++){b=S.bones[i];if(b.taken)continue;
if(b.x<pcx-40||b.x>pcx+40)continue;
if(Math.abs(pcx-b.x)<24&&Math.abs(pcy-b.y)<26){b.taken=true;S.boneCount++;S.score+=50;spawnParticles(b.x,b.y,5,'#fff3c2',1.8,0.03,20,2.2);sfx('bone');
if(S.boneCount%20===0&&S.lives<5){S.lives++;popText(b.x,b.y-16,'1UP','#3b6d11');sfx('chk');}}}
for(i=0;i<S.meats.length;i++){const mt=S.meats[i];
if(!mt.taken&&Math.abs(pcx-mt.x)<26&&Math.abs(pcy-mt.y)<28){mt.taken=true;S.powerTimer=480;S.hp=HP_MAX;S.score+=200;popText(mt.x,mt.y-14,'パワーアップ','#b8770f');spawnParticles(mt.x,mt.y,12,'#ffd23e',2.6,0.05,30,3);sfx('power');}}
for(i=S.checkpointIndex+1;i<CHECKPOINTS.length;i++){if(S.player.x>CHECKPOINTS[i]){S.checkpointIndex=i;S.hp=HP_MAX;popText(CHECKPOINTS[i],356,'中間地点','#3b6d11');sfx('chk');}}
for(i=S.shots.length-1;i>=0;i--){const sh=S.shots[i];sh.x+=sh.vx;
let hit=false;const cc2=Math.floor((sh.x+(sh.vx>0?6:-6))/TILE),rr2b=Math.floor(sh.y/TILE);
if(isSolid(cc2,rr2b)){spawnParticles(sh.x,sh.y,4,'#cfeaff',1.5,0,12,2);hit=true;}
if(!hit&&sh.isCharged){for(j=S.enemyBullets.length-1;j>=0;j--){const eb2=S.enemyBullets[j];if(Math.abs(sh.x-eb2.x)<12&&Math.abs(sh.y-eb2.y)<12){S.enemyBullets.splice(j,1);spawnParticles(sh.x,sh.y,4,'#ffd23e',1.6,0,12,2);sfx('tink');}}}
if(!hit){for(j=0;j<S.cats.length;j++){const e2=S.cats[j];if(!e2.deadTimer&&sh.x>e2.x-4&&sh.x<e2.x+e2.w+4&&sh.y>e2.y-4&&sh.y<e2.y+e2.h+4){killEnemy(e2,100);hit=true;break;}}}
if(!hit){for(j=0;j<S.crows.length;j++){const e3=S.crows[j];if(!e3.deadTimer&&sh.x>e3.x-4&&sh.x<e3.x+e3.w+4&&sh.y>e3.y-4&&sh.y<e3.y+e3.h+4){killEnemy(e3,100);hit=true;break;}}}
if(!hit){for(j=0;j<S.turrets.length;j++){const tu=S.turrets[j];if(!tu.deadTimer&&sh.x>tu.x-4&&sh.x<tu.x+tu.w+4&&sh.y>tu.y-4&&sh.y<tu.y+tu.h+4){tu.hp-=sh.damage;tu.hitFlash=8;sfx('tink');spawnParticles(sh.x,sh.y,4,'#ffffff',1.6,0,12,2);
if(tu.hp<=0){tu.deadTimer=1;spawnRing(tu.x+15,tu.y+13);killEnemy(tu,300);}hit=true;break;}}}
if(!hit&&S.bossStarted&&!S.bossDead&&S.boss.mode!=='wait'){if(sh.x>S.boss.x-4&&sh.x<S.boss.x+S.boss.w+4&&sh.y>S.boss.y-4&&sh.y<S.boss.y+S.boss.h+4){damageBoss(sh.damage);hit=true;}}
if(hit||sh.x<S.cameraX-60||sh.x>S.cameraX+VIEW_W+60)S.shots.splice(i,1);}
for(i=S.turrets.length-1;i>=0;i--){const tu2=S.turrets[i];
if(tu2.deadTimer){tu2.deadTimer++;if(tu2.deadTimer>21)S.turrets.splice(i,1);continue;}
if(tu2.hitFlash>0)tu2.hitFlash--;
const dxp=pcx-(tu2.x+15);
if(dxp>-430&&dxp<430){tu2.facing=dxp>0?1:-1;tu2.cooldown--;
if(tu2.cooldown<=0){tu2.cooldown=105;S.enemyBullets.push({x:tu2.x+15+tu2.facing*18,y:tu2.y+12,vx:tu2.facing*3.4,vy:0});sfx('tshot');}}
if(S.state==='play'&&rectsOverlap(S.player,tu2)){if(S.powerTimer>0){tu2.deadTimer=1;spawnRing(tu2.x+15,tu2.y+13);killEnemy(tu2,300);}
else if(S.player.vy>1&&S.player.y+S.player.h<tu2.y+tu2.h*0.7){tu2.hp-=1;tu2.hitFlash=8;S.player.vy=-8.5;S.player.usedDoubleJump=false;sfx('tink');if(tu2.hp<=0){tu2.deadTimer=1;spawnRing(tu2.x+15,tu2.y+13);killEnemy(tu2,300);}}
else hurtPlayer(2,tu2.x+15);}}
for(i=S.enemyBullets.length-1;i>=0;i--){const eb=S.enemyBullets[i];eb.x+=eb.vx;eb.y+=eb.vy;
const ec=Math.floor(eb.x/TILE),er=Math.floor(eb.y/TILE);
if(isSolid(ec,er)){spawnParticles(eb.x,eb.y,3,'#f0a03c',1.2,0,10,2);S.enemyBullets.splice(i,1);continue;}
if(eb.x<S.cameraX-80||eb.x>S.cameraX+VIEW_W+80||eb.y>VIEW_H+40){S.enemyBullets.splice(i,1);continue;}
if(S.state==='play'&&S.player.invincible<=0&&eb.x>S.player.x-3&&eb.x<S.player.x+S.player.w+3&&eb.y>S.player.y-3&&eb.y<S.player.y+S.player.h+3){
if(S.powerTimer>0){spawnParticles(eb.x,eb.y,3,'#ffd23e',1.4,0,10,2);S.enemyBullets.splice(i,1);continue;}
hurtPlayer(1,eb.x);S.enemyBullets.splice(i,1);}}
for(i=S.cats.length-1;i>=0;i--){const ct=S.cats[i];
if(ct.deadTimer){ct.deadTimer++;if(ct.deadTimer>21)S.cats.splice(i,1);continue;}
ct.x+=ct.facing*1.1;
const front=ct.facing>0?ct.x+ct.w+1:ct.x-1;
const fc=Math.floor(front/TILE),fr=Math.floor((ct.y+ct.h-2)/TILE);
if(isSolid(fc,fr)||!isSolid(fc,fr+1)){ct.facing*=-1;ct.x+=ct.facing*2.2;}
if(S.state==='play'&&rectsOverlap(S.player,ct)){
if(S.powerTimer>0)killEnemy(ct,100);
else if(S.player.vy>1&&S.player.y+S.player.h<ct.y+ct.h*0.7)stompEnemy(ct,false);
else hurtPlayer(2,ct.x+17);}}
for(i=S.crows.length-1;i>=0;i--){const cr=S.crows[i];
if(cr.deadTimer){cr.deadTimer++;cr.vy+=0.5;cr.y+=cr.vy;if(cr.deadTimer>39||cr.y>VIEW_H+60)S.crows.splice(i,1);continue;}
cr.x+=cr.facing*cr.speed;
if(cr.x<cr.minX){cr.x=cr.minX;cr.facing=1;}if(cr.x>cr.maxX){cr.x=cr.maxX;cr.facing=-1;}
cr.y=cr.baseY+Math.sin(S.time*0.05+cr.phase)*24;
if(S.state==='play'&&rectsOverlap(S.player,cr)){
if(S.powerTimer>0)killEnemy(cr,100);
else if(S.player.vy>1&&S.player.y+S.player.h<cr.y+cr.h*0.7)stompEnemy(cr,true);
else hurtPlayer(2,cr.x+15);}}
if(!S.bossStarted&&!S.bossDead&&S.player.x>243*TILE){S.bossStarted=true;S.boss.mode='intro';S.boss.timer=0;S.boss.x=250*TILE;S.boss.y=-100;popText(250*TILE+35,240,'ニャン大将','#5a4632');}
if(S.bossStarted&&!S.bossDead){const bs=S.boss;bs.timer++;if(bs.invincible>0)bs.invincible--;
bs.facing=pcx<bs.x+bs.w/2?-1:1;
if(bs.mode==='intro'){bs.vy=Math.min(bs.vy+0.55,15);bs.y+=bs.vy;bs.onGround=false;resolveTiles(bs,'y');
if(bs.onGround&&bs.timer>70){bs.mode='idle';bs.timer=45;}}
else if(bs.mode==='die'){bs.deathTimer++;
if(bs.deathTimer%8===0){spawnRing(bs.x+bs.w/2+(Math.random()-0.5)*50,bs.y+bs.h/2+(Math.random()-0.5)*40);sfx('boom');}
if(bs.deathTimer>72){S.bossDead=true;S.score+=1000;popText(bs.x+35,bs.y,'+1000','#a86b1e');popText(GOAL_X+58,300,'扉が開いた','#3b6d11');spawnRing(bs.x+35,bs.y+28);sfx('clear');}}
else{
if(bs.mode==='idle'){bs.vx*=0.8;bs.timer--;
if(bs.timer<=0){const dd=Math.abs(pcx-bs.x),rn=Math.random();
if(dd>250||rn<0.38){bs.mode='jump';bs.vy=-13.5;bs.vx=bs.facing*4.4;}
else if(rn<0.72){bs.mode='shoot';bs.timer=50;bs.hasFired=false;}
else{bs.mode='hop';bs.hopsLeft=2;bs.vy=-8;bs.vx=bs.facing*3;}}}
else if(bs.mode==='shoot'){bs.vx=0;bs.timer--;
if(bs.timer===28&&!bs.hasFired){bs.hasFired=true;const mx2=bs.x+bs.w/2+bs.facing*30,my2=bs.y+22;
const ang=Math.atan2(pcy-my2,pcx-mx2);
for(j=-1;j<=1;j++){S.enemyBullets.push({x:mx2,y:my2,vx:Math.cos(ang+j*0.22)*4,vy:Math.sin(ang+j*0.22)*4});}sfx('tshot');}
if(bs.timer<=0){bs.mode='idle';bs.timer=40;}}
const wasB=bs.onGround;
bs.vy=Math.min(bs.vy+0.55,15);
bs.x+=bs.vx;if(bs.x<ARENA_LEFT+4){bs.x=ARENA_LEFT+4;bs.vx=bs.vx<0?-bs.vx:bs.vx;}if(bs.x>ARENA_RIGHT-bs.w-4){bs.x=ARENA_RIGHT-bs.w-4;bs.vx=bs.vx>0?-bs.vx:bs.vx;}
resolveTiles(bs,'x');bs.onGround=false;bs.y+=bs.vy;resolveTiles(bs,'y');
if(bs.onGround&&!wasB){
if(bs.mode==='jump'){spawnParticles(bs.x+35,bs.y+bs.h,9,'#c9b08a',2.4,0.08,24,3);
S.enemyBullets.push({x:bs.x-6,y:bs.y+bs.h-10,vx:-3.2,vy:0});S.enemyBullets.push({x:bs.x+bs.w+6,y:bs.y+bs.h-10,vx:3.2,vy:0});sfx('tshot');bs.vx=0;bs.mode='idle';bs.timer=55;}
else if(bs.mode==='hop'){bs.hopsLeft--;
if(bs.hopsLeft>0){bs.vy=-8;bs.vx=bs.facing*3;}else{bs.vx=0;bs.mode='idle';bs.timer=45;}}}
if(S.state==='play'&&rectsOverlap(S.player,bs)){
if(S.powerTimer>0){if(S.powerHitCooldown<=0){damageBoss(1);S.powerHitCooldown=20;}}
else if(S.player.vy>1&&S.player.y+S.player.h<bs.y+bs.h*0.5){damageBoss(1);S.player.vy=-10;S.player.usedDoubleJump=false;}
else hurtPlayer(2,bs.x+bs.w/2);}}}
if(S.player.y>VIEW_H+60)loseLife();
if(S.state==='play'&&S.bossDead&&S.player.x+S.player.w>GOAL_X+8)clearGame();}
